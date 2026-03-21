"use client";

import { useState } from "react";

export default function MarkdownGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        <i className="fas fa-question-circle"></i>
        Markdown Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Markdown Formatting Guide</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Headings</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  # Heading 1<br />
                  ## Heading 2<br />
                  ### Heading 3<br />
                  #### Heading 4
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Text Formatting</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  **Bold text**<br />
                  *Italic text*<br />
                  ***Bold and Italic***<br />
                  ~~Strikethrough~~
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Lists</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  Unordered list:<br />
                  - Item 1<br />
                  - Item 2<br />
                  &nbsp;&nbsp;- Nested item<br />
                  <br />
                  Ordered list:<br />
                  1. First item<br />
                  2. Second item<br />
                  3. Third item
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Links</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  [Link text](https://example.com)
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Images</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  ![Alt text](image-url.jpg)
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Quotes</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  &gt; This is a quote<br />
                  &gt; It can span multiple lines
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Code</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  Inline code: `code here`<br />
                  <br />
                  Code block:<br />
                  ```<br />
                  function example() &#123;<br />
                  &nbsp;&nbsp;return "Hello";<br />
                  &#125;<br />
                  ```
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Horizontal Line</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  ---
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tables</h4>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                  | Header 1 | Header 2 |<br />
                  | -------- | -------- |<br />
                  | Cell 1   | Cell 2   |<br />
                  | Cell 3   | Cell 4   |
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <i className="fas fa-info-circle mr-2"></i>
                  <strong>Tip:</strong> Use the toolbar buttons in the editor for quick formatting, 
                  or click "Preview" to see how your content will look!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
