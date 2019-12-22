import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Quagga from 'quagga';
import config from './config'
import { addProduct, changeProduct } from '../actions/products.action';





function useToggle() {
	const [state, setState] = useState(false)
	const off = () => setState(false)
	const on = () => setState(true)
	return [state, {on, off}]
}

function useScanner({onStart=() => {}, onMatch=() => {}, fetchBarcode, socket,  }) {
	const [state, setState] = useState({ match: false, processing: false })
	// const [list, setList] = useState([])
	const list = useSelector(state => state.products)
	const [isPaused, pauseCTL] = useToggle()
	const scanner = useRef()
	const codes = useRef({})
	const isDisabled = useRef()
	const dispatch = useDispatch()


	useEffect(() => {
		isDisabled.current = false

		socket.on("connect", msg => console.log("Connected -> " , socket.id))

		socket.on("/recieve/barcode", barcode => console.log("Barcode -> " , barcode))

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
			fetchBarcode(state.match.code).then(product => product.json()).then(product => {
				if(product) {
					dispatch(changeProduct(product))
				}
			})
		}

	}, [state.match])





	const detected = useCallback(data => {
		if(isDisabled.current) return
		if (codes.current[data.codeResult.code] >= 5) {
			let drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;
			drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));

			socket.emit("/post/barcode", "scanner", data.codeResult.code)

			setState(prev => ({...prev, match: data.codeResult }))
			codes.current = {}
			dispatch(addProduct(data.codeResult))
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
