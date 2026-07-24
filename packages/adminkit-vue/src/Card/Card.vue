<script setup lang="ts">
import { computed } from 'vue'
import 'adminkit/card.css'
import { card, type CardProps } from './Card.variants'

const props = withDefaults(defineProps<CardProps>(), { variant: 'elevated' })
const s = computed(() => card(props))
</script>

<template>
  <div :class="s.root">
    <div v-if="$slots.header" :class="s.header"><slot name="header" /></div>
    <div :class="s.body"><slot /></div>
    <div v-if="$slots.footer" :class="s.footer"><slot name="footer" /></div>
  </div>
</template>
