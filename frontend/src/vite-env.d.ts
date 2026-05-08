/// <reference types="vite/client" />

declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin: number | [number, number] | [number, number, number, number]
    filename: string
    image?: {
      type?: 'jpeg' | 'png' | 'webp'
      quality?: number
    }
    html2canvas?: {
      scale?: number
      useCORS?: boolean
      letterRendering?: boolean
      scrollY?: number
      windowWidth?: number
      windowHeight?: number
    }
    jsPDF?: {
      unit?: 'mm' | 'cm' | 'in' | 'pt'
      format?: string
      orientation?: 'portrait' | 'landscape'
    }
    pagebreak?: {
      mode?: ('avoid-all' | 'css' | 'legacy')[]
    }
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf
    from(element: HTMLElement): Html2Pdf
    save(): Promise<void>
  }

  const html2pdf: () => Html2Pdf
  export default html2pdf
}
