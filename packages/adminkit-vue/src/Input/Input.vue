<script setup lang="ts">
// EXAMPLE component — reference implementation, not a locked API.
import { computed, useId } from 'vue'
import 'adminkit/input.css'
import { field, type InputProps } from './Input.variants'

const props = defineProps<InputProps>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const s = computed(() => field({ invalid: !!props.error, disabled: props.disabled }))
const inputId = useId()
const msgId = useId()
</script>

<template>
  <div :class="s.root">
    <label v-if="label" :class="s.label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :class="s.input"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error || hint ? msgId : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <!-- role="alert" so a validation error that appears after render is announced;
         the hint is static description, not an alert -->
    <p v-if="error" :id="msgId" :class="s.msg" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="msgId" :class="s.msg">{{ hint }}</p>
  </div>
</template>
