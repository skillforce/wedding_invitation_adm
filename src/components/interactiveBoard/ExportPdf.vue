<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { Stage } from 'konva/lib/Stage'
import { useThemeStore } from '@/stores/theme'
import { getThemeDefinition } from '@/themes'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/components/interactiveBoard/tableKonvaConfigs'

const props = defineProps<{
  stageRef: { getNode(): Stage } | null
}>()

const { t } = useI18n()
const themeStore = useThemeStore()
const boardTheme = computed(() => getThemeDefinition(themeStore.theme).board)

async function doExport() {
  const { jsPDF } = await import('jspdf')
  const stage = props.stageRef?.getNode()
  if (!stage) return

  const pixelRatio = 2
  const sw = CANVAS_WIDTH
  const sh = CANVAS_HEIGHT

  // Temporarily reset stage to 1:1 so toDataURL captures the full workspace
  const savedScale = stage.scaleX()
  const savedPos = stage.position()
  stage.scale({ x: 1, y: 1 })
  stage.position({ x: 0, y: 0 })
  stage.batchDraw()

  const stageDataUrl = stage.toDataURL({ x: 0, y: 0, width: sw, height: sh, pixelRatio })

  // Restore user's zoom/pan
  stage.scale({ x: savedScale, y: savedScale })
  stage.position(savedPos)
  stage.batchDraw()

  const canvas = document.createElement('canvas')
  canvas.width = sw * pixelRatio
  canvas.height = sh * pixelRatio
  const ctx = canvas.getContext('2d')!
  ctx.scale(pixelRatio, pixelRatio)

  ctx.fillStyle = boardTheme.value.canvasBackground
  ctx.fillRect(0, 0, sw, sh)

  const dotSpacing = 28
  ctx.fillStyle = boardTheme.value.canvasDot
  for (let x = dotSpacing / 2; x < sw; x += dotSpacing) {
    for (let y = dotSpacing / 2; y < sh; y += dotSpacing) {
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0, sw, sh)
    const dataUrl = canvas.toDataURL('image/png')
    const orientation = sw >= sh ? 'landscape' : 'portrait'
    const pdf = new jsPDF({ orientation, unit: 'px', format: [sw, sh] })
    pdf.addImage(dataUrl, 'PNG', 0, 0, sw, sh)
    pdf.save(t('seating.pdfFileName'))
  }
  img.src = stageDataUrl
}
</script>

<template>
  <slot :on-click="doExport">
    <Button
      :label="t('seating.savePdf')"
      icon="pi pi-file-pdf"
      size="small"
      severity="secondary"
      @click="doExport"
    />
  </slot>
</template>