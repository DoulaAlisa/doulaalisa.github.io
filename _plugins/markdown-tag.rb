=begin
  Jekyll tag to include Markdown text from _includes directory preprocessing with Liquid.
  Usage:
    {% markdown <filename> %}
=end
module Jekyll
  class MarkdownTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @includes_dir = "_copy"
      @text = text.strip
    end

    def render(context)
      dir = resolved_includes_dir(context)
      file = @text
      # tmpl = File.read File.join Dir.pwd, "_copy", @text
      path = File.join(dir, file)
      site = context.registers[:site]
      converter = site.getConverterImpl(Jekyll::Converters::Markdown)
      tmpl = (Liquid::Template.parse(source(path, context))).render site.site_payload
      html = converter.convert(tmpl)
    end
    def resolved_includes_dir(context)
      File.join(File.realpath(context.registers[:site].source), @includes_dir)
    end
    # Grab file read opts in the context
    def file_read_opts(context)
      context.registers[:site].file_read_opts
    end
    # This method allows to modify the file content by inheriting from the class.
    def source(file, context)
      File.read(file, file_read_opts(context))
    end
  end
end
Liquid::Template.register_tag('markdown', Jekyll::MarkdownTag)