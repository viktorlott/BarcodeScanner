import React, { useRef, useEffect, useState, useCallback } from 'react';

import Quagga from 'quagga';
import config from './config'



function useToggle() {
	const [state, setState] = useState(false)
	const off = () => setState(false)
	const on = () => setState(true)
	return [state, {on, off}]
}

function useScanner({onStart=() => {}, onMatch=() => {}, fetchBarcode}) {
	const [state, setState] = useState({ match: false, processing: false })
	const [list, setList] = useState([])
	const [isPaused, pauseCTL] = useToggle()
	const scanner = useRef()
	const codes = useRef({})
	const isDisabled = useRef()

	useEffect(() => {
		isDisabled.current = false
		const cb = err => {
			if (err) {
				console.log(err);
				return
			}
	
			Quagga.start();
			onStart && onStart()
	
			Quagga.onProcessed(processed)
			// Quagga.offProcessed(offProcessed)
	
			Quagga.onDetected(detected)
			// Quagga.offDetected(offDetected)
	
		}

		Quagga.init(config({ target: scanner.current }), cb);
	}, [])


	useEffect(() => {
		if(state.match) {
			fetchBarcode(state.match.code).then(product => {
				setList(prev => prev.map(result => {
					if(result.code === product.productid) {
						result.product = product
					}
					return result
				}))
			})
		}

	}, [state.match])


	const detected = useCallback(data => {
		if(isDisabled.current) return
		if (codes.current[data.codeResult.code] >= 5) {
			let drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;
			drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));

			setState(prev => ({...prev, match: data.codeResult }))
			codes.current = {}

			setList(prev => ([...prev, data.codeResult]))
			pauseCTL.on()
			isDisabled.current = true
		}

		if (!codes.current[data.codeResult.code]) codes.current[data.codeResult.code] = 0
		codes.current[data.codeResult.code] += 1

	}, [onMatch, isDisabled])


	const processed = useCallback(result => {
		if(isDisabled.current) return
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    // Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "#00FF00", lineWidth: 2});
                });
            }

            // if (result.box) {
            //     Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00FF00", lineWidth: 2});
            // }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: '#FF4500', lineWidth: 3});
            }
        }
	}, [isDisabled])

	const start = useCallback(() => {
		setState({ match: false, processing: false })
		isDisabled.current = false
		pauseCTL.off()
	}, [])

	const stop = useCallback(() => Quagga.stop(), [])

	const bind = { ref: scanner }
	const ctl = { start, stop, isPaused, list, pauseCTL }

	return [bind, state, ctl]

}

export default useScanner;
