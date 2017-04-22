var transparent = "rgba(0,0,0,0)",
    light = {
        nature: "#fff757",
        pink: "#ff9ea9",
    },
    dark = {
        gray: "#333",    
    };

module.exports = (function() {
    return {
        style: {
            trans: "200ms", 
            max: {
                width: 600,
            },
            modes: {
                black: {
                    page: {
                        bg: "#000",
                        fg: "#f0e0ff",
                    },
                },
                deep: {
                    page: {
                        bg: "#0a0014",
                        fg: "#5c2e57",
                    },
                },
                standard: {
                    page: {
                        trans: "1s",
                        bg: "#fff",
                        fg: "#000",
                        size: '1.3em',
                        font: 'Lustria',
                    },
                    title: {
                          size: '3.9em',
                          font: 'Cinzel',
                          pad: '0 10px',
                          //margin: '50px 0 40px 0',
                    },
                    header: {
                        size: '2.5em',
                        font: 'Cormorant Unicase',
                    },
                    context: {
                        font: 'Cinzel',
                        fg: '#666',
                        as: "inline-block",
                        margin: "15px 15px 15px 0",
                        pad: '10px',
                    },
                    styler: {
                        box: "0px solid #ffffff",
                        border: {
                            radius: "8px",
                        },
                        start: "off",
                        trans: "200ms",
                        states: {
                            on: {
                                border: {
                                    color: "#333",
                                    pad: "8px", 
                                },
                                bg: dark.gray,
                                fg: "#fff",
                            },
                            off: {
                                bg: "#fff",
                                border: {
                                    color: "#fff",
                                    pad: "0px",
                                },
                            }
                        },
                    },
                    line: {
                        pad: "10px",
                        box: "1px solid #fff",
                        start: "passive",
                        trans: "200ms",
                        states: {
                            active: {
                                border: {
                                    color: "#ff0",    
                                },
                                bg: "#000", // light.nature,
                                fg: "#fafafa",
                            },
                            passive: {
                                border: {
                                    color: "#fff",    
                                },
                                bg: "#fff",
                                fg: "#000",
                            },
                        },
                    },
                },
            },
            presets: {
                code: {
                    font: 'Cutive Mono',
                }
            },
        },
    };
})();
