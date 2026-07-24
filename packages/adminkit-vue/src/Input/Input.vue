<script setup lang="ts">
import { computed } from 'vue'
import 'adminkit/input.css'
import { field } from './Input.variants'

const props = withDefaults(
  defineProps<{ label?: string; hint?: string; error?: string; placeholder?: string; disabled?: boolean; modelValue?: string }>(),
  {},
)
defineEmits<{ 'update:modelValue': [value: string] }>()
const s = computed(() => field({ invalid: !!props.error, disabled: props.disabled }))
</script>

<template>
  <div :class="s.root">
    <label v-if="label" :class="s.label">{{ label }}</label>
    <input :class="s.input" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <p v-if="error" :class="s.msg">{{ error }}</p>
    <p v-else-if="hint" :class="s.msg">{{ hint }}</p>
  </div>
</template>
