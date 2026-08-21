import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  Heading2, Heading3, List, ListOrdered, 
  Quote, Link as LinkIcon, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Undo, Redo, 
  Code, Eye, Sparkles, Minus, RemoveFormatting
} from 'lucide-react';

interface WYSIWYGEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tuliskan isi artikel lengkap di sini...'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const isInternalUpdate = useRef(false);

  // Sync external value to contentEditable div when value changes externally
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      const targetValue = value || '';
      if (editorRef.current.innerHTML !== targetValue) {
        // Detect if value is rich HTML using regex
        const hasHtmlTags = /<\/?(p|div|h[1-6]|ul|ol|li|blockquote|span|strong|em|b|i|br|table|a|hr|section)\b/i.test(targetValue);
        
        if (!hasHtmlTags) {
          // Convert raw markdown newlines to HTML if value doesn't have HTML tags
          const htmlContent = targetValue
            .split('\n\n')
            .map(p => {
              if (p.startsWith('### ')) return `<h3>${p.replace('### ', '')}</h3>`;
              if (p.startsWith('## ')) return `<h2>${p.replace('## ', '')}</h2>`;
              if (p.startsWith('- ') || p.startsWith('* ')) {
                const items = p.split('\n').map(l => `<li>${l.replace(/^[-*]\s+/, '')}</li>`).join('');
                return `<ul>${items}</ul>`;
              }
              if (/^\d+\.\s+/.test(p)) {
                const items = p.split('\n').map(l => `<li>${l.replace(/^\d+\.\s+/, '')}</li>`).join('');
                return `<ol>${items}</ol>`;
              }
              return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
            })
            .join('');
          editorRef.current.innerHTML = htmlContent || '';
        } else {
          // It is HTML with tags
          let cleanHtml = targetValue;
          if (cleanHtml.includes('&lt;') && cleanHtml.includes('&gt;')) {
            cleanHtml = cleanHtml
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'");
          }
          editorRef.current.innerHTML = cleanHtml;
        }
      }
    }
    isInternalUpdate.current = false;
  }, [value, isSourceMode]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      checkActiveFormats();
    }
  };

  const executeCommand = (command: string, val: string | undefined = undefined) => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
  };

  const checkActiveFormats = () => {
    const formats: string[] = [];
    try {
      if (document.queryCommandState('bold')) formats.push('bold');
      if (document.queryCommandState('italic')) formats.push('italic');
      if (document.queryCommandState('underline')) formats.push('underline');
      if (document.queryCommandState('strikeThrough')) formats.push('strikeThrough');
      if (document.queryCommandState('insertUnorderedList')) formats.push('insertUnorderedList');
      if (document.queryCommandState('insertOrderedList')) formats.push('insertOrderedList');
      if (document.queryCommandState('justifyLeft')) formats.push('justifyLeft');
      if (document.queryCommandState('justifyCenter')) formats.push('justifyCenter');
      if (document.queryCommandState('justifyRight')) formats.push('justifyRight');
      if (document.queryCommandState('justifyFull')) formats.push('justifyFull');

      // Check current node hierarchy
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const parent = selection.anchorNode.nodeType === Node.TEXT_NODE 
          ? selection.anchorNode.parentElement 
          : selection.anchorNode as HTMLElement;

        if (parent) {
          if (parent.closest('h2')) formats.push('h2');
          if (parent.closest('h3')) formats.push('h3');
          if (parent.closest('blockquote')) formats.push('blockquote');
          if (parent.closest('p')) formats.push('p');
          if (parent.closest('ul')) formats.push('insertUnorderedList');
          if (parent.closest('ol')) formats.push('insertOrderedList');
          if (parent.closest('a')) formats.push('link');
        }
      }
    } catch {
      // Ignore
    }
    setActiveFormats(Array.from(new Set(formats)));
  };

  const handleInsertHeading = (tag: 'h2' | 'h3' | 'p') => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    let currentTag = '';
    if (selection && selection.anchorNode) {
      const parent = selection.anchorNode.nodeType === Node.TEXT_NODE 
        ? selection.anchorNode.parentElement 
        : selection.anchorNode as HTMLElement;
      if (parent?.closest('h2')) currentTag = 'h2';
      else if (parent?.closest('h3')) currentTag = 'h3';
      else if (parent?.closest('blockquote')) currentTag = 'blockquote';
    }

    const targetTag = (currentTag === tag && tag !== 'p') ? 'p' : tag;

    try {
      document.execCommand('formatBlock', false, `<${targetTag}>`);
    } catch {
      try {
        document.execCommand('formatBlock', false, targetTag);
      } catch {
        // Fallback
      }
    }
    handleInput();
  };

  const handleInsertLink = () => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const url = prompt('Masukkan URL Tautan (contoh: https://contoh.com):', 'https://');
    if (url && url !== 'https://' && url.trim() !== '') {
      document.execCommand('createLink', false, url.trim());
      handleInput();
    }
  };

  const handleInsertQuote = () => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    let isQuote = false;
    if (selection && selection.anchorNode) {
      const parent = selection.anchorNode.nodeType === Node.TEXT_NODE 
        ? selection.anchorNode.parentElement 
        : selection.anchorNode as HTMLElement;
      if (parent?.closest('blockquote')) isQuote = true;
    }

    const targetTag = isQuote ? 'p' : 'blockquote';
    try {
      document.execCommand('formatBlock', false, `<${targetTag}>`);
    } catch {
      document.execCommand('formatBlock', false, targetTag);
    }
    handleInput();
  };

  const handleInsertCallout = () => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString().trim();
      const callout = document.createElement('div');
      callout.className = 'callout-box';
      callout.innerHTML = selectedText ? `💡 <strong>Catatan:</strong> ${selectedText}` : '💡 <strong>Catatan Penting Pengadaan:</strong> Tuliskan poin penting atau perhatian khusus di sini...';
      range.deleteContents();
      range.insertNode(callout);

      // Move cursor after the callout box
      const newRange = document.createRange();
      newRange.setStartAfter(callout);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      handleInput();
    }
  };

  const handleInsertHorizontalRule = () => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('insertHorizontalRule', false, undefined);
    handleInput();
  };

  const handleRemoveFormat = () => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('removeFormat', false, undefined);
    try {
      document.execCommand('formatBlock', false, '<p>');
    } catch {
      document.execCommand('formatBlock', false, 'p');
    }
    handleInput();
  };

  const wordCount = value.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const charCount = value.replace(/<[^>]*>/g, '').length;

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#073B75] focus-within:border-transparent transition">
      {/* Top Toolbar */}
      <div 
        className="bg-slate-100/90 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700 select-none"
        onMouseDown={(e) => {
          // Prevent losing focus / selection when clicking around the toolbar
          if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}
      >
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5 mr-0.5">
          <button
            type="button"
            title="Urungkan (Undo)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Ulangi (Redo)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5 mr-0.5">
          <button
            type="button"
            title="Judul Utama (H2)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleInsertHeading('h2')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeFormats.includes('h2') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-800 bg-white border border-slate-200'
            }`}
          >
            <Heading2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">H2</span>
          </button>
          <button
            type="button"
            title="Sub Judul (H3)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleInsertHeading('h3')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeFormats.includes('h3') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-800 bg-white border border-slate-200'
            }`}
          >
            <Heading3 className="w-3.5 h-3.5" />
            <span className="text-[11px]">H3</span>
          </button>
          <button
            type="button"
            title="Paragraf Normal"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleInsertHeading('p')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFormats.includes('p') && !activeFormats.includes('h2') && !activeFormats.includes('h3')
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700 bg-white border border-slate-200'
            }`}
          >
            P
          </button>
        </div>

        {/* Bold, Italic, Underline, Strikethrough */}
        <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5 mr-0.5">
          <button
            type="button"
            title="Tebal (Bold)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('bold')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('bold') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Miring (Italic)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('italic')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('italic') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Garis Bawah (Underline)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('underline')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('underline') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Coret (Strikethrough)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('strikeThrough')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('strikeThrough') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5 mr-0.5">
          <button
            type="button"
            title="Daftar Poin (Bulleted List)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('insertUnorderedList')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('insertUnorderedList') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Daftar Bernomor (Numbered List)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('insertOrderedList')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('insertOrderedList') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Text Alignments */}
        <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5 mr-0.5">
          <button
            type="button"
            title="Rata Kiri (Align Left)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('justifyLeft')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('justifyLeft') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Rata Tengah (Align Center)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('justifyCenter')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('justifyCenter') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Rata Kanan (Align Right)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('justifyRight')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('justifyRight') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Rata Kiri Kanan (Justify)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('justifyFull')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('justifyFull') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Special Elements: Quote, Callout, Link, Divider, Clear */}
        <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5 mr-0.5">
          <button
            type="button"
            title="Kutipan / Quote"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertQuote}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('blockquote') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Kotak Catatan Khusus (Callout)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertCallout}
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#073B75] text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Callout</span>
          </button>
          <button
            type="button"
            title="Sisipkan Tautan (Link)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertLink}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeFormats.includes('link') 
                ? 'bg-[#073B75] text-white shadow-xs' 
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Garis Pemisah (Horizontal Line)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertHorizontalRule}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Bersihkan Format"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleRemoveFormat}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsSourceMode(!isSourceMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              isSourceMode 
                ? 'bg-amber-500 text-white shadow-xs' 
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
          >
            {isSourceMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Mode Visual</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5 text-slate-600" />
                <span>Mode HTML/Kode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {isSourceMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-300 focus:outline-none leading-relaxed border-0 resize-y"
          placeholder="Tulis kode HTML atau teks di sini..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={checkActiveFormats}
          onMouseUp={checkActiveFormats}
          onSelect={checkActiveFormats}
          data-placeholder={placeholder}
          className="wysiwyg-content p-5 min-h-[260px] max-h-[480px] overflow-y-auto text-sm sm:text-base text-slate-800 leading-relaxed focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
          style={{
            wordBreak: 'break-word'
          }}
        />
      )}

      {/* Editor Footer / Stats */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-3 font-medium">
          <span>{wordCount} kata</span>
          <span className="text-slate-300">•</span>
          <span>{charCount} karakter</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Editor Visual Siap Digunakan</span>
        </div>
      </div>
    </div>
  );
};
