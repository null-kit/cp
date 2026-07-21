<template>
  <form id="form" class="mx-auto max-w-lg space-y-5" @submit.prevent="onSubmit">
    <ControlFormInput v-model="formData.name" name="name" label="Name" placeholder="Enter Name" required />

    <ControlFormInput
      v-model="formData.email"
      type="email"
      name="email"
      label="Email"
      placeholder="Enter Email"
      required
    />

    <ControlFormInput
      v-model="formData.password"
      type="password"
      name="password"
      label="Password"
      placeholder="Enter Password"
      required
    />
  </form>
</template>

<script setup lang="ts">
const model = defineModel<ControlSession | undefined>();

const { clearErrors, setErrors } = useValidate();

const formData = reactive({
  name: model.value ? model.value?.name : undefined,
  email: model.value ? model.value?.email : undefined,
  password: model.value ? model.value?.password : undefined
});

const onSubmit = () => {
  clearErrors();

  $fetch(`/api/users/${model.value ? model.value.id : ''}`, {
    method: model.value ? 'PUT' : 'POST',
    body: formData
  })
    .then(() => {
      navigateTo('/control/users');
      useToast().setToast('Success!', `User has been ${model.value ? 'updated' : 'created'}`, 'success');
    })
    .catch((error) => setErrors(error.data.data));
};
</script>
