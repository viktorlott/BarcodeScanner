
const schema = {
    name: "Barcodes",
    id: "1234",
    functions: [
        {
            name: "SendStuff",
            function: {	
                type: "dispatch",
                name: "joinRoom",
                arguments: [
                    { 
                        type: "anonymous",
                        returns: { 
                            type: "object", 
                            data: [
                                {
                                    key: "roomname", 
                                    path: "components._room"
                                }
                            ] 
                        }
                    }
                ]
            }
        }
    ],
	layout: [
		{
			type: "row",
			props: {
				gutter: [8, 8]
			},
			children: [
				{
					type: "col",
					props: {
						span: 24
                    },
                    effect: [

                    ],

					children: [
						{
							type: "Input",
							name: "_room",
							scheme: {
								state: { 
									type: String, 
									required: true, 
									match: "scanner"
								} 
                            },
                            
							rules: [
								{ path: "state", type: "Required", message: "Field is required" },
								{ path: "state", type: "RegExp",   message: "Match not found" }
							],
							required: true,
							defaultState: "",
							props: {
								label: "Room",
								style: { width: "100%" }
							},
							actions: [],
							bind: []
						},
					]
				},
			]
		},
		{
			type: "row",
			props: {
				gutter: [8, 8]
			},
			children: [
				{
					type: "col",
					props: {
						span: 24
					},
					children: [
						{
							type: "Input",
							name: "_name",
							scheme: {
								state: { 
									type: String, 
									required: true, 
									match: "scanner"
								} 
							},
							rules: [
								{ path: "state", type: "Required", message: "Field is required" },
								{ path: "state", type: "RegExp",   message: "Match not found" }
							],
							required: true,
							defaultState: "",
							props: {
								label: "Name",
                                style: { width: "100%" },
                                defaultValue: {
                                    type: "string",
                                    data: { value: "hello" }
                                }
							},
							actions: [],
							bind: []
						},
					]
				},
			]
		},
		{
			type: "row",
			props: {
			},
			children: [
				{
					type: "col",
					props: {
						span: 2,
						offset: 4
					},
					children: [
						{
							type: "Button",
							name: "_button_join",
							bind: [],
							props: {
                                label: "Join",

                            },
                            effects: {
                                onMount: [
                                    { 
                                        type: "statement", 
                                        condition: {   
                                            type: "and",
                                            right: { 
                                                type: "string", 
                                                data: {
                                                    value: "test12344343"
                                                }
                                            }, 
                                            left: {   
                                                type: "equal",
                                                right: { 
                                                    type: "string", 
                                                    data: {
                                                        value: "test1234"
                                                    }
                                                }, 
                                                left: { 
                                                    type: "string", 
                                                    data: {
                                                        value: "test1234"
                                                    }
                                                } 
                                        }, 
                                    },
                                    then: {
                                        type: "function",
                                        name: "SendStuff"
                                    },
                                    elseThen: {
                                        type: "bool",
                                        data: {
                                            value: false
                                        }
                                    }
                                    }
                                ],
                                onUnMount: [

                                ],
                                onUpdate: [

                                ]
                        },
                        events: {
                            onClick: [
                                { type: "function", name: "SendStuff" }
                            ]
                        },
                        bind: ["_room"],
						},
					]
				},
				{
					type: "col",
					props: {
						span: 2,
					},
					children: [
						{
							type: "Button",
							name: "_button_create",
							bind: [],
							props: {
								label: "Create"
                            }

						},
					]
				}
			]
		},
	]
}


export default schema