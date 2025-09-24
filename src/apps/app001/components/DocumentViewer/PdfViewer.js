import * as React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import AnnotationLayer from './AnnotationLayer'; // <-- import

const PdfViewer = ({
    fileUrl,
    annotateMode,
    annotationCategory,
    annotations,
    setAnnotationMode,
    setAnnotations,
    annotationMode, // "box" or "free"
}) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const viewerRef = React.useRef(null);
    const [zoomLevel, setZoomLevel] = React.useState(1.0);

    // For demo, set a fixed PDF canvas size (you can make this dynamic)
    const pdfWidth = 800;
    const pdfHeight = 1100;

    const handleWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = -e.deltaY;
            let newZoom = zoomLevel + (delta > 0 ? 0.1 : -0.1);
            newZoom = Math.max(0.5, Math.min(newZoom, 3.0));
            setZoomLevel(newZoom);
        }
    };

    React.useEffect(() => {
        const container = viewerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [zoomLevel]);

    return (
        <>

        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div
                ref={viewerRef}
                style={{ height: '80vh', width: '100%', position: 'relative' }}
            >
                {/* PDF Viewer */}
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    defaultScale={zoomLevel}
                />
                {/* Annotation overlay, absolutely positioned */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none', // let AnnotationLayer handle pointer events
                    }}
                >
                    <AnnotationLayer
                        width={viewerRef.current?.clientWidth || pdfWidth}
                        height={viewerRef.current?.clientHeight || pdfHeight}
                        annotations={annotations}
                        setAnnotations={setAnnotations}
                        annotationMode={annotationMode} // <-- use annotationMode, not mode
                        category={annotationCategory}
                        annotateMode={annotateMode} // <-- pass this!
                        setAnnotationMode={setAnnotationMode}
                    />
                </div>
            </div>
        </Worker>
        </>
    );
};

export default PdfViewer;
