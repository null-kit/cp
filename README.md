# Control Panel Layer

A comprehensive **Nuxt Layer** providing Control Panel components with TypeScript support. Built with Prisma, Tailwind CSS and optimized for developer experience.

## 📦 Installation

### 1. From GitHub

```typescript
export default defineNuxtConfig({
  extends: [['github:null-kit/cp', { install: true }]]
});
```

### 2. From NPM

```bash
npm install @null-kit/cp
```

Then extend it in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: [['@null-kit/cp', { install: true }]]
});
```

## 🎨 Quick Start

### 1. Configure Styles

```scss
// app.css
@import 'tailwindcss';

// import control panel styles
@import '@null-kit/cp';

// best practice to create own article styles but you can use default styles
@import '@null-kit/cp/article';
```

### 2. Configure Panel

#### 1. Logo and Navigation

```typescript
// app.config.ts
export default defineAppConfig({
  control: {
    logo: {
      path: '/logo/primary.svg', // path to logo image
      class: 'h-6' // class to apply to logo image
    },
    navigation: [
      // add routes here
      // Users is default route, so you can omit it
      {
        name: 'Users',
        link: '/control/users'
      }
    ]
  }
});
```

#### 2. Prisma

```typescript
// define user model in prisma/schema.prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  createdAt DateTime  @default(now())
  updatedAt DateTime? @updatedAt

  @@map("users")
}
```

### 3. Client Side

#### 1. Create Mutation Component

Create a form component to mutate a blog post.

```
components/control/MutateBlogPost.vue
```

```vue
<template>
  <form id="form" class="mx-auto max-w-5xl space-y-5" @submit.prevent="onSubmit">
    <div class="grid gap-5 md:grid-cols-2">
      <ControlFormInput
        v-model="formData.title"
        label="Title"
        name="title"
        placeholder="Enter Title"
        required
        @input="formData.slug = createSlug(formData.title)"
      />

      <ControlFormInput v-model="formData.slug" label="Slug" name="slug" placeholder="Enter Slug" required />
    </div>

    <ControlFormImage v-model:preview="formData.image" v-model:file="formData.imageFile" name="image" />

    <ControlFormEditor v-model="formData.body" name="body" />

    <ControlFormCheckGroup
      v-model="formData.categoryId"
      :options="categories"
      type="radio"
      label="Category"
      name="categoryId"
      required
      :fallback="{
        emptyText: 'No Categories:',
        createRoute: '/control/blog/categories/create',
        createText: 'Create First Category'
      }"
    />

    <ControlFormInput v-model="formData.metaTitle" label="Meta Title" name="metaTitle" placeholder="Enter Meta Title" />

    <ControlFormInput
      v-model="formData.metaDescription"
      label="Meta Description"
      name="metaDescription"
      placeholder="Enter Meta Description"
      required
    />

    <ControlFormCheck v-model="formData.hidden" name="hidden" label="Hidden" is-switch />
  </form>
</template>

<script setup lang="ts">
const model = defineModel<Post>();

const { setErrors, clearErrors } = useValidate();

const formData = reactive({
  title: model.value?.title,
  slug: model.value?.slug,
  image: model.value?.image,
  imageFile: undefined,
  body: model.value?.body,
  categoryId: model.value?.categoryId,
  metaTitle: model.value?.metaTitle,
  metaDescription: model.value?.metaDescription,
  hidden: model.value?.hidden || false
});

const { data: categories } = await useFetch<Category[]>('/api/blog/categories');

const onSubmit = async () => {
  clearErrors();

  if (formData.imageFile) {
    formData.image = await useUploadMedia({
      newFile: formData.imageFile,
      oldFile: formData.image,
      directory: 'blog/posts',
      width: 1200,
      height: 630
    });
  }

  const url = `/api/blog/posts/${model.value?.id ? model.value.id : ''}`;

  $fetch(url, { method: model.value?.id ? 'PUT' : 'POST', body: formData })
    .then(() => {
      navigateTo('/control/blog/posts');

      useToast().setToast('Success!', `Record has been ${model.value?.id ? 'updated' : 'created'}`, 'success');
    })
    .catch(async (error) => {
      await useDeleteMedia(formData.image);

      setErrors(error.data.data);
    });
};

onUnmounted(() => clearErrors());
</script>
```

#### 2. Create Control Pages

1. Index page to display a blog posts.

```
pages/control/blog/posts/index.vue
```

```vue
<template>
  <ControlBody action-name="New Post" action-link="/control/blog/posts/create">
    <template v-if="records && records.data.length > 0" #cards>
      <ControlCard
        v-for="record in records.data"
        :key="record.id"
        :record="record"
        :route-open="'/blog/' + record.slug"
        :route-delete="'/api/blog/posts/' + record.id"
        :route-edit="'/control/blog/posts/' + record.id"
      >
        <div v-if="record.category">{{ record.category.title }}</div>
      </ControlCard>
    </template>

    <ControlEmpty v-if="!records || records.data.length === 0" />

    <template v-if="records && records.totalPages > 1" #footer>
      <ControlPagination :total-pages="records.totalPages" class="mx-auto" />
    </template>
  </ControlBody>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'control', middleware: 'auth', title: 'Blog: Posts' });

const { data: records } = await useFetch<{ data: Post[]; totalPages: number }>('/api/blog/posts', {
  params: computed(() => ({
    page: useRoute().query.page
  }))
});
</script>
```

2. Create page to create a blog post.

```
pages/control/blog/posts/create.vue
```

```vue
<template>
  <ControlBody submit="Create">
    <ControlMutatePost />
  </ControlBody>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'control', middleware: 'auth', title: 'Blog: New Post' });
</script>
```

3. Edit page to update a blog post.

```
pages/control/blog/posts/[id].vue
```

```vue
<template>
  <ControlBody v-if="data" :title="data.title" submit="Update">
    <ControlMutatePost v-model="data" />
  </ControlBody>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'control', middleware: 'auth' });

const id = useRoute().params.id;

const data = await $fetch<Post>(`/api/blog/posts/${id}`).catch(() => {
  navigateTo('/control/blog/posts/create');
});
</script>
```

### 4. Server Side

#### 1. Define Zod Schema

```
server/validation/blog.ts
```

```typescript
import { z } from 'zod/v4';

export const postSchema = z.object({
  title: z.string('Please enter title').min(3, 'Please enter title'),
  slug: z
    .string('Please enter slug')
    .min(3, 'Please enter slug')
    .transform((value) => createSlug(value)),
  image: z.string('Please select image').min(1, 'Please select image'),
  body: z.string('Please enter body').min(3, 'Please enter body'),
  categoryId: z.number('Please select category'),
  hidden: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string('Please enter description').min(3, 'Please enter description')
});
```

#### 2. Create a POST request to create a blog post.

```
server/api/blog/posts/index.post.ts
```

```typescript
export default defineEventHandler(async (event) => {
  // Utility to check if user is authenticated
  await requireAuth(event);

  const body = await readBody(event);
  // Utility to validate body using zod schema
  const data = validateSchema(postSchema.safeParse(body));

  // Define prisma client on your side
  // For example:
  // import { PrismaClient } from '@prisma/client';
  // export const prisma = new PrismaClient();
  await prisma.post.create({ data }).catch((error) => {
    throw createError({ status: 500, message: error });
  });

  return { message: 'Record created successfully' };
});
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
