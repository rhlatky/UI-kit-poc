<script setup lang="ts">
import { computed } from 'vue'
import 'adminkit/button.css'
import { button, type ButtonProps } from './Button.variants'

const props = withDefaults(defineProps<ButtonProps>(), { size: 'md', disabled: false })
const cls = computed(() => button(props))
</script>

<template>
  <button :class="cls" :disabled="props.disabled"><slot /></button>
</template>
