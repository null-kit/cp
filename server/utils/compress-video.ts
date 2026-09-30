import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type CompressVideo = {
  width?: number | null;
  height?: number | null;
  fit?: string;
};

// H.264 with yuv420p requires even dimensions
const even = (value: number) => Math.max(2, Math.round(value / 2) * 2);

const scaleFilter = ({ width, height, fit = 'cover' }: CompressVideo) => {
  const w = width ? even(width) : null;
  const h = height ? even(height) : null;

  if (w && h) {
    switch (fit) {
      case 'fill':
        return `scale=${w}:${h}`;
      case 'contain':
        return `scale=${w}:${h}:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2`;
      case 'inside':
        return `scale=${w}:${h}:force_original_aspect_ratio=decrease:force_divisible_by=2`;
      case 'outside':
        return `scale=${w}:${h}:force_original_aspect_ratio=increase:force_divisible_by=2`;
      default:
        return `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`;
    }
  }

  if (w) return `scale=${w}:-2`;
  if (h) return `scale=-2:${h}`;

  return 'scale=trunc(iw/2)*2:trunc(ih/2)*2';
};

const runFfmpeg = (args: string[]) => {
  return new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn(process.env.FFMPEG_PATH || 'ffmpeg', args);

    let stderr = '';

    ffmpeg.stderr.on('data', (chunk) => (stderr += chunk));

    ffmpeg.on('error', (error) => reject(new Error(`ffmpeg is not available: ${error.message}`)));

    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim().split('\n').slice(-3).join('\n')));
    });
  });
};

export const compressVideo = async (data: Buffer, options: CompressVideo = {}) => {
  const id = randomUUID();
  const input = join(tmpdir(), `${id}-input`);
  const output = join(tmpdir(), `${id}-output.mp4`);

  try {
    await writeFile(input, data);

    await runFfmpeg([
      '-y',
      '-i',
      input,
      '-vf',
      scaleFilter(options),
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      '28',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-movflags',
      '+faststart',
      output
    ]);

    return await readFile(output);
  } catch (error) {
    throw createError({ statusCode: 422, message: `Video processing failed: ${(error as Error).message}` });
  } finally {
    await Promise.all([rm(input, { force: true }), rm(output, { force: true })]);
  }
};
