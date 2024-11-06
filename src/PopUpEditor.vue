<template>
  <div v-if="visible" class="popup-editor">
    <div class="popup-overlay" @click="closeEditor"></div>
    <div class="popup-content">
      <button class="close-button" @click="closeEditor">&times;</button>
      <section v-if="editor" class="buttons d-flex align-items-center flex-wrap mx-2">
        <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="mx-1 btn-text">
          Bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="mx-1 btn-text">
          Italic
        </button>
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()" class="btn-icon mx-1">
          <i class="fa fa-undo" aria-hidden="true"></i>
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()" class="btn-icon mx-1">
          <i class="fa fa-redo" aria-hidden="true"></i>
        </button>
      </section>
      <EditorContent :editor="editor" class="editor-content" />
      <button class="save-button" @click="saveContent">Save</button>
    </div>
  </div>
</template>

<script>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

export default {
  components: {
    EditorContent,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const editor = useEditor({
      editorProps: {
        attributes: {
          class: 'custom-editor',
        },
      },
      extensions: [
        StarterKit,
      ],
      content: props.content || '<p>Enter your text here...</p>',
    });

    const closeEditor = () => {
      emit('close');
    };

    const saveContent = () => {
      if (editor.value) {
        emit('save', editor.value.getHTML());
        closeEditor();
      }
    };

    return {
      editor,
      closeEditor,
      saveContent,
    };
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
};
</script>

<style scoped>
.popup-editor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
}

.popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: relative;
  background: linear-gradient(135deg, rgba(14, 0, 19, 0.85), rgba(17, 0, 36, 0.9)); /* Linear gradient background */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 80%;
  max-width: 600px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.save-button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.editor-content {
  min-height: 100px;
  max-height: 400px;
  overflow-y: auto;
}

.btn-text, .btn-icon {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  cursor: pointer;
}

.btn-text:hover, .btn-icon:hover {
  text-decoration: underline;
}

.btn-icon i {
  font-size: 1.2em;
}

.is-active {
  font-weight: bold;
}

.custom-editor {
  border: 1px solid grey;
  padding: 10px;
  background-color: aliceblue;
  border-radius: 4px;
}
</style>