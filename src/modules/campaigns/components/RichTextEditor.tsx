import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Strikethrough, List, ListOrdered, Smile, Save } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSaveTemplate?: (message: string) => void;
}

const RichTextEditor = ({ value, onChange, placeholder, onSaveTemplate }: RichTextEditorProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('message-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = document.getElementById('message-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const newText = value.substring(0, start) + emoji + value.substring(start);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-t-lg border border-b-0 border-gray-200">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('*', '*')}
          className="h-8 w-8 p-0"
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('_', '_')}
          className="h-8 w-8 p-0"
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('~', '~')}
          className="h-8 w-8 p-0"
          title="Tachado"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('\n• ')}
          className="h-8 w-8 p-0"
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('\n1. ')}
          className="h-8 w-8 p-0"
          title="Lista Numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300" />
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="h-8 w-8 p-0"
            title="Emojis"
          >
            <Smile className="h-4 w-4" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute top-10 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-64 h-48 overflow-y-auto">
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="w-8 h-8 hover:bg-gray-100 rounded text-lg flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {onSaveTemplate && (
          <>
            <div className="w-px h-6 bg-gray-300" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSaveTemplate(value)}
              disabled={!value.trim()}
              className="h-8 w-8 p-0"
              title="Salvar Template"
            >
              <Save className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <Textarea
        id="message-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-32 resize-none border-2 border-gray-200 focus:border-orange-primary transition-colors rounded-t-none"
      />
      <div className="text-sm text-gray-500">
        {value.length}/1000 caracteres
      </div>
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
