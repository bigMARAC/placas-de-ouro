<template>
  <div class="markdown-content" v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{
  content?: string
  preview?: boolean
}>()

const sanitizedHtml = computed(() => {
  try {
    const markdownContent = props.content || ''
    const html = marked.parse(markdownContent, { async: false }) as string
    
    if (props.preview) {
      const paragraphs = html.split('</p>')
      if (paragraphs.length === 0) return ''
      
      const firstParagraph = paragraphs[0] + '</p>'
      if (firstParagraph.length > 300) {
        return DOMPurify.sanitize(firstParagraph.substring(0, 300) + '...')
      }
      return DOMPurify.sanitize(firstParagraph)
    }
    
    return DOMPurify.sanitize(html)
  } catch (error) {
    console.error('Error processing markdown:', error)
    return ''
  }
})
</script>

<style scoped>
.markdown-content {
  width: 100%;
}

.markdown-content :deep(h1) {
  font-size: 1.8em;
  margin-bottom: 0.5em;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

.markdown-content :deep(p) {
  margin-bottom: 1em;
  line-height: 1.6;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5em;
}

.markdown-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid rgba(0, 0, 0, 0.1);
  padding-left: 1em;
  color: rgba(0, 0, 0, 0.7);
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
    font-size: 1.5em;
  }

  .markdown-content :deep(h2) {
    font-size: 1.25em;
  }
}
</style>
