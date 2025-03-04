declare module "react-pdf-html" {
  interface HtmlProps {
    /**
     * HTML content to render
     */
    children: string;

    /**
     * Custom styles to apply to the HTML content
     */
    style?: string;

    /**
     * Additional props
     */
    [key: string]: unknown;
  }

  /**
   * Component to render HTML content in a PDF
   */
  export const Html: React.FC<HtmlProps>;
}
