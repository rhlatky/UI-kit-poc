<script setup lang="ts">
// EXAMPLE component — reference implementation, not a locked API.
import { computed } from 'vue'
import 'adminkit/button.css'
import { button, type ButtonProps } from './Button.variants'

// Style defaults live in Button.variants.ts, not here.
const props = withDefaults(defineProps<ButtonProps>(), { type: 'button' })
const cls = computed(() => button(props))
</script>

<template>
  <button :class="cls" :type="props.type" :disabled="props.disabled"><slot /></button>
</template>
