import { useEffect, useRef, useState } from "react"
import { Spin } from "antd"
import type { Document } from "src/@types/document"

interface DocumentViewerProps {
  document: Document
  height?: string
}

declare global {
  interface Window {
    NutrientViewer: {
      load: (config: {
        container: string | HTMLElement
        document: string
        licenseKey?: string
      }) => Promise<any>
      unload: (container: string | HTMLElement) => Promise<void>
    }
  }
}

export default function DocumentViewer({ document, height = "100%" }: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerInstanceRef = useRef<any>(null)
  const isLoadingRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || !document) return

    let isMounted = true
    let timeoutId: NodeJS.Timeout | null = null

    const checkViewerLoaded = () => {
      return !!window.NutrientViewer
    }

    const unloadViewer = async (container: HTMLElement) => {
      if (window.NutrientViewer?.unload) {
        try {
          await window.NutrientViewer.unload(container)
        } catch (unloadErr: any) {
          if (unloadErr?.message?.includes("already used")) {
            console.warn("Container already unloaded or not mounted")
          } else {
            console.warn("Error unloading viewer instance:", unloadErr)
          }
        }
      }
    }

    const loadViewer = async () => {
      if (!checkViewerLoaded()) {
        timeoutId = setTimeout(() => {
          if (isMounted) {
            loadViewer()
          }
        }, 100)
        return
      }

      if (isLoadingRef.current) return
      isLoadingRef.current = true

      try {
        if (!isMounted || !containerRef.current) return

        setLoading(true)
        setError(null)

        await unloadViewer(containerRef.current)

        if (!isMounted || !containerRef.current) return

        const fileUrl = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}${document.file_path}`
        const licenseKey = import.meta.env.VITE_NUTRIENT_LICENSE_KEY

        const config: any = {
          container: containerRef.current,
          document: fileUrl
        }

        if (licenseKey) {
          config.licenseKey = licenseKey
        }

        const instance = await window.NutrientViewer.load(config)

        if (isMounted && containerRef.current) {
          viewerInstanceRef.current = instance
          
          setTimeout(() => {
            if (containerRef.current) {
              const canvasElements = containerRef.current.querySelectorAll('canvas')
              canvasElements.forEach((canvas) => {
                ;(canvas as HTMLElement).style.fontSmooth = 'always'
                ;(canvas as HTMLElement).style.webkitFontSmoothing = 'antialiased'
                ;(canvas as HTMLElement).style.mozOsxFontSmoothing = 'grayscale'
              })

              const style = document.createElement('style')
              style.textContent = `
                .pspdfkit-watermark,
                .pspdfkit-watermark-overlay,
                [class*="watermark"],
                [class*="evaluation"],
                [id*="watermark"],
                [id*="evaluation"],
                div[style*="color: red"],
                div[style*="color:rgb(255"],
                div[style*="color:#ff"],
                div:contains("For Evaluation"),
                div:contains("Evaluation Purposes") {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  height: 0 !important;
                  width: 0 !important;
                  overflow: hidden !important;
                }
              `
              containerRef.current.appendChild(style)

              const allDivs = containerRef.current.querySelectorAll('div')
              allDivs.forEach((div) => {
                const text = div.textContent || ''
                if (text.includes('For Evaluation') || text.includes('Evaluation Purposes')) {
                  ;(div as HTMLElement).style.display = 'none'
                  ;(div as HTMLElement).style.visibility = 'hidden'
                  ;(div as HTMLElement).style.opacity = '0'
                  ;(div as HTMLElement).style.height = '0'
                  ;(div as HTMLElement).style.width = '0'
                  ;(div as HTMLElement).style.overflow = 'hidden'
                }
              })
            }
          }, 1000)
          
          setLoading(false)
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error loading document viewer:", err)
          setError(err?.message || "Không thể tải tài liệu")
          setLoading(false)
        }
      } finally {
        isLoadingRef.current = false
      }
    }

    loadViewer()

    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      isLoadingRef.current = false

      if (containerRef.current && window.NutrientViewer?.unload) {
        unloadViewer(containerRef.current).catch((err) => {
          console.warn("Error unloading viewer in cleanup:", err)
        })
      }
      viewerInstanceRef.current = null
    }
  }, [document])

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff4d4f"
        }}
      >
        {error}
      </div>
    )
  }

  return (
    <div
      style={{
        width: "100%",
        height: height,
        minHeight: "400px",
        position: "relative"
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <div
        ref={containerRef}
        className="nutrient-viewer-container"
        style={{
          width: "100%",
          height: "100%",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.3s",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
        }}
      />
    </div>
  )
}

