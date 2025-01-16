<template>
  <div class="markdown-content" v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{
  content: string
  preview?: boolean
}>()

const sanitizedHtml = computed(() => {
  // Parse markdown synchronously
  var html = marked.parse(props.content, { async: false }) as string
  
  if (props.preview) {
    // For preview, extract first paragraph and limit length
    const div = document.createElement('div')
    div.innerHTML = html
    const firstParagraph = div.querySelector('p')
    if (firstParagraph) {
      let text = firstParagraph.textContent || ''
      if (text.length > 150) {
        text = text.substring(0, 150) + '...'
      }
      html = `<p>${text}</p>`
    }
  }
  
  // Sanitize HTML synchronously
  return DOMPurify.sanitize(html)
})
</script>

<style scoped>
.markdown-content :deep(h1) {
  font-size: 1.8em;
  margin-bottom: 0.8em;
  font-weight: 600;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  margin-bottom: 0.6em;
  font-weight: 600;
}

.markdown-content :deep(h3) {
  font-size: 1.3em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-content :deep(p) {
  margin-bottom: 1em;
  line-height: 1.6;
}

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5em;
  line-height: 1.6;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #ccc;
  margin: 1em 0;
  padding-left: 1em;
  color: #666;
}

.markdown-content :deep(code) {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-content :deep(pre) {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-content :deep(a) {
  color: #1867c0;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .markdown-content :deep(h1) {
    font-size: 1.6em;
  }

  .markdown-content :deep(h2) {
    font-size: 1.4em;
  }

  .markdown-content :deep(h3) {
    font-size: 1.2em;
  }

  .markdown-content :deep(p), .markdown-content :deep(li) {
    font-size: 0.95em;
  }
}
</style>
