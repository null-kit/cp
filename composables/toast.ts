import { h, TransitionGroup, render } from 'vue';

type Toast = {
  id?: number;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
  timeoutId?: NodeJS.Timeout;
};

const meta = {
  success: {
    icon: 'square-check',
    color: 'text-green-600'
  },
  error: {
    icon: 'square-cancel',
    color: 'text-red-500'
  },
  info: {
    icon: 'square-info',
    color: 'text-blue-500'
  }
};

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => []);

  const renderToasts = () => {
    const container = document.querySelector('#teleports');

    if (!container) return;

    const toastElements = toasts.value.map((toast) => {
      return h(
        'div',
        {
          key: toast.id,
          class: 'bg-white ring ring-slate-200 items-start text-sm flex max-w-md gap-2 rounded-xl p-4 shadow-lg',
          onMouseenter: () => holdToast(toast.id, true),
          onMouseleave: () => holdToast(toast.id, false)
        },
        [
          h('div', { class: 'w-full' }, [
            h('h3', { class: 'font-semibold ' + meta[toast.type ? toast.type : 'info'].color }, toast.title),
            toast.message && h('p', { class: 'mt-1' }, toast.message)
          ]),
          h(
            'svg',
            {
              class: 'size-3 opacity-30 shrink-0 cursor-pointer duration-200 hover:opacity-100 mt-1',
              viewBox: '0 0 16 16',
              onClick: () => removeToast(toast.id)
            },
            h('path', { stroke: 'currentColor', 'stroke-width': '2', d: 'M2 2l12 12M2 14L14 2' })
          )
        ]
      );
    });

    const toastGroup = h(
      TransitionGroup,
      {
        tag: 'div',
        appear: true,
        enterFromClass: 'opacity-0 translate-y-5',
        enterToClass: 'opacity-100 translate-y-0 duration-500',
        leaveToClass: 'opacity-0 translate-x-5 duration-500',
        appearToClass: 'opacity-100 translate-y-0 duration-500',
        class: 'fixed bottom-4 right-4 z-30 grid gap-2',
        onAfterLeave: () => !toasts.value.length && render(null, container)
      },
      () => toastElements
    );

    render(toastGroup, container);
  };

  const startTimer = async (toast: Toast) => {
    if (toast.timeoutId) clearTimeout(toast.timeoutId);

    toast.timeoutId = setTimeout(() => removeToast(toast.id), 3000);
  };

  const setToast = (title: Toast['title'], message?: Toast['message'], type?: Toast['type']) => {
    const toast: Toast = { id: Date.now(), title, message, type };

    toasts.value.push(toast);

    renderToasts();
    startTimer(toast);
  };

  const removeToast = (id: Toast['id']) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);

    renderToasts();
  };

  const holdToast = (id: Toast['id'], hold: boolean) => {
    const toast = toasts.value.find((toast) => toast.id === id);

    if (toast && hold) clearTimeout(toast.timeoutId);
    if (toast && !hold) startTimer(toast);
  };

  return { setToast };
};
