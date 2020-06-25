import * as product from './products.action'
import * as actions from './actions'


const joinRoom = e => (console.log("hello",e), {type: "JOIN_ROOM_TEST", payload: e })

export default { ...actions, ...product, joinRoom}


