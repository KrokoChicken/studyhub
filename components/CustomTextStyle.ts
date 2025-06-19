import { Mark, mergeAttributes } from '@tiptap/core'

export const CustomTextStyle = Mark.create({
  name: 'customTextStyle',

  addAttributes() {
    return {
      fontSize: { default: null },
      fontFamily: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'span[style]' }]
  },

  renderHTML({ HTMLAttributes }) {
    // Merge default HTML attributes with current ones
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setCustomTextStyle:
        (attributes) =>
        ({ chain }) => {
          return chain().setMark(this.name, attributes).run()
        },

      unsetCustomTextStyle:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run()
        },
    }
  },
})