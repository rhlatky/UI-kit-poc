<script setup lang="ts">
// EXAMPLE component — reference implementation, not a locked API.
import { computed } from 'vue'
import 'adminkit/button.css'
import { button, type ButtonProps } from './Button.variants'

// Only DOM attributes get defaults here. Style defaults (variant, size) belong to
// defaultVariants in Button.variants.ts — see the note there. `disabled` needs no
// entry: Vue casts an absent boolean prop to false.
const props = withDefaults(defineProps<ButtonProps>(), { type: 'button' })
const cls = computed(() => button(props))
</script>

<template>
  <button :class="cls" :type="props.type" :disabled="props.disabled"><slot /></button>
</template>
