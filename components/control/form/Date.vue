<template>
  <div class="relative">
    <label v-if="label" for="date" class="control-form-label mb-2">
      {{ label }}
      <span v-if="required" title="Required field" class="control-form-required">*</span>
    </label>

    <ControlDropdown>
      <template #trigger>
        <button type="button" id="date" class="control-form-input truncate text-left">
          {{ formatDateRange }}
        </button>
      </template>

      <div class="p-2 text-center">
        <div class="flex justify-between gap-2">
          <button type="button" class="control-btn control-btn-sm px-2" @click="prevMonth">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="size-5">
              <path fill="none" stroke-width="2" stroke="currentColor" d="m20 6-10 10 10 10" />
            </svg>
          </button>

          <div class="flex w-full justify-center gap-2 font-medium">
            <select
              v-model="currentMonth"
              class="cursor-pointer appearance-none bg-transparent text-center outline-none"
              @change="setYearMonth"
            >
              <option v-for="(month, index) in months" :key="index" :value="index">
                {{ month }}
              </option>
            </select>

            <select
              v-model="currentYear"
              class="cursor-pointer appearance-none bg-transparent text-center outline-none"
              @change="setYearMonth"
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <button type="button" class="control-btn control-btn-sm px-2" @click="nextMonth">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="size-5">
              <path fill="none" stroke-width="2" stroke="currentColor" d="m12 26 10-10-10-10" />
            </svg>
          </button>
        </div>

        <div class="grid min-w-max grid-cols-7 overflow-hidden rounded-md ring ring-slate-200">
          <div v-for="day in days" :key="day" class="p-1 text-xs font-medium uppercase opacity-40">
            {{ day }}
          </div>

          <button
            v-for="(date, index) in dates"
            :key="index"
            type="button"
            class="bg-white p-1 ring ring-slate-200 disabled:cursor-not-allowed disabled:text-slate-100"
            :disabled="isDisabled(date)"
            @click="selectDate(date)"
          >
            <span
              :class="[
                'mx-auto grid size-8 place-items-center rounded-full duration-200',
                { 'opacity-40': isOutside(date) },
                isSelected(date)
                  ? 'bg-blue-500 text-white hover:bg-blue-500'
                  : 'hover:bg-blue-500/20 hover:text-blue-500'
              ]"
            >
              {{ date.getDate() }}
            </span>
          </button>
        </div>
      </div>
    </ControlDropdown>

    <ControlFormValidate v-if="name" :name />
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/shared/utils/cp-format';

const { disabledDates = [] } = defineProps<{
  label?: string;
  required?: boolean;
  disabledDates?: Date[];
  iso?: boolean;
  name?: string;
}>();

const [model, modifiers] = defineModel<Date | string | undefined>({
  required: true,
  get(value) {
    if (value && modifiers.iso) {
      return formatDate(value, { format: 'iso' });
    }

    return value;
  },
  set(value) {
    if (value && modifiers.iso) {
      if (Array.isArray(value)) return value.map((date) => formatDate(date, { format: 'iso' }));

      return formatDate(value, { format: 'iso' });
    }

    return value;
  }
});

const selectedDates = ref<Date[]>([]);

const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
});

const dates = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const days: Date[] = [];

  let startDay = firstDay.getDay() - 1;

  if (startDay === -1) startDay = 6;

  const totalCells = Math.ceil((lastDay.getDate() + startDay) / 7) * 7;

  for (let i = 1; i <= totalCells; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i - startDay);
    days.push(date);
  }

  return days;
});

const formatDateRange = computed(() => {
  if (selectedDates.value.length === 0) return 'Select date';

  return String(formatDate(selectedDates.value[0]!));
});

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const setYearMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value, 1);
};

const selectDate = (date: Date) => {
  if (isDisabled(date)) return;

  selectedDates.value = [date];
  model.value = modifiers.iso ? formatDate(date, { format: 'iso' }) : date;

  currentMonth.value = date.getMonth();
  currentYear.value = date.getFullYear();
};

const isSelected = (date: Date) => {
  return selectedDates.value.some((d) => new Date(d).toDateString() === date.toDateString());
};

const isOutside = (date: Date) => date.getMonth() !== currentMonth.value;

const isDisabled = (date: Date) => {
  return disabledDates.some((d) => new Date(d).toDateString() === date.toDateString());
};

onMounted(() => {
  if (model.value) {
    selectedDates.value = [new Date(model.value)];
  }
});
</script>
