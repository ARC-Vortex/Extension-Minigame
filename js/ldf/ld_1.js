addLayer("LV", {
    rawText() {
        return `
            <div style="line-height: 10px">
            <b class="mT">LV<sup>1</sup></b><br>
            <b class="ide">volatile</b>
            </div>`
    },
    symbol: "P",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        superdata       : {
            lv_data: {
                display: {
                    'I'     :{
                            level       :{
                                        level_amount:new Decimal(1.0000), level_gain:new Decimal(1.0000)
                                        }
                                        ,
                            exp         :{
                                        exp_amount  :new Decimal(0.00E0), exp_req   :new Decimal(10.000),
                                        exp_gain    :new Decimal(0.0000)
                                        },

                            },
                    'II'    :{}
                },
                logical: {
                    'I'     :{
                            exp_scale   :{
                                        // calculating lv_exp scale
                                        // sc_base + sc_scalar * ( sc_mul_1 + sc_scalar * ( sc_mul_2 ) )
                                        // ^ ( sc_pow_1 ^ sc_scalar ^ ( sc_pow_2 ^ sc_scalar ) )

                                        // sc_scalar is based on that specific lv_display data lv_amount
                                        sc_base     :new Decimal(10.000), sc_scalar :new Decimal(2.0000),
                                        sc_mul_1    :new Decimal(1.0500), sc_mul_2  :new Decimal(1.1000),
                                        sc_pow_1    :new Decimal(1.0100), sc_pow_2  :new Decimal(1.0010)
                                        }
                            },
                    'II'    :{}
                }
            },

            utility: {

            }
        },

        init_superdata  : {
            lv_data: {
                display: {
                    'I'     :{
                        level       :{
                            level_amount:new Decimal(1.0000), level_gain:new Decimal(1.0000)
                        }
                        ,
                        exp         :{
                            exp_amount  :new Decimal(0.00E0), exp_req   :new Decimal(10.000),
                            exp_gain    :new Decimal(0.0000)
                        },

                    },
                    'II'    :{}
                },
                logical: {
                    'I'     :{
                        exp_scale   :{
                            // calculating lv_exp scale
                            // sc_base + sc_scalar * ( sc_mul_1 + sc_scalar * ( sc_mul_2 ) )
                            // ^ ( sc_pow_1 ^ sc_scalar ^ ( sc_pow_2 ^ sc_scalar ) )

                            // sc_scalar is based on that specific lv_display data lv_amount
                            sc_base     :new Decimal(10.000), sc_scalar :new Decimal(2.0000),
                            sc_mul_1    :new Decimal(1.0500), sc_mul_2  :new Decimal(1.1000),
                            sc_pow_1    :new Decimal(1.0100), sc_pow_2  :new Decimal(1.0010),
                            sc_end_product                              :new Decimal(undefined)
                        }
                    },
                    'II'    :{}
                }
            },

            utility: {

            }
        },
        lv_data: {
            level_display: {
                'I'  : {
                    level_amount  : new Decimal(0),
                    level_exp     : new Decimal(0),
                    level_exp_ps  : new Decimal(0),
                    level_exp_req : new Decimal(10),

                    level_scale_mods: {
                        base_add_scale   : new Decimal(2),
                        base_mul_scale   : new Decimal(1.05),
                        base_pow_scale_1 : new Decimal(1.01),
                        base_pow_scale_2 : new Decimal(1.001),
                    }
                },
                'II' : {
                    level_amount  : new Decimal(0),
                    level_exp     : new Decimal(0),
                    level_exp_ps  : new Decimal(0),
                    level_exp_req : new Decimal(10),

                    level_scale_mods: {
                        base_add_scale   : new Decimal(2),
                        base_mul_scale   : new Decimal(1.05),
                        base_pow_scale_1 : new Decimal(1.01),
                        base_pow_scale_2 : new Decimal(1.001),
                    }
                },
                'III': {
                    level_amount  : new Decimal(0),
                    level_exp     : new Decimal(0),
                    level_exp_ps  : new Decimal(0),
                    level_exp_req : new Decimal(10),

                    level_scale_mods: {
                        base_add_scale   : new Decimal(2),
                        base_mul_scale   : new Decimal(1.05),
                        base_pow_scale_1 : new Decimal(1.01),
                        base_pow_scale_2 : new Decimal(1.001),
                    }
                },
                'IV' : {
                    level_amount  : new Decimal(0),
                    level_exp     : new Decimal(0),
                    level_exp_ps  : new Decimal(0),
                    level_exp_req : new Decimal(10),

                    level_scale_mods: {
                        base_add_scale   : new Decimal(2),
                        base_mul_scale   : new Decimal(1.05),
                        base_pow_scale_1 : new Decimal(1.01),
                        base_pow_scale_2 : new Decimal(1.001),
                    }
                }},
        }
    }},
    color: "#4BDC13",
    row: 0,
    tooltip() {
        return 'Nothing to show'
    },

    // my TMT code got corrupted on load a while ago
    // this was pain to make, why does TMT now whine about arrays :sob:?

    // 3/4 of the functions are automated so far, it would be 100% but I ran into errors that can't be fixed at the moment
    update: function(delta) {
        let proxy = player['LV'].superdata.lv_data.display
        let LV_ps = proxy['I'].exp.exp_gain
        tmp['LV'].LV_check_I

        proxy['I'].exp.exp_amount = proxy['I'].exp.exp_amount.add((LV_ps).mul(delta))
    },

    EXP_gain_calculation_I: function() {
        let base_gain = player[this.layer].init_superdata.lv_data.display['I'].exp.exp_gain
        base_gain = base_gain.add(tmp['LV'].buyables['XP_RATE_I'].effect)
        player[this.layer].superdata.lv_data.display['I'].exp.exp_gain = base_gain
    },

    LV_check_I: function() {
    let proxy = player['LV'].superdata.lv_data.display
    tmp['LV'].LV_level_recalc_I
            if (proxy['I'].exp.exp_amount.gte(proxy['I'].exp.exp_req)) {
                tmp['LV'].LV_level_up('I')
            }
    },

    LV_level_up: function(lv_type_input) {
        let proxy = player['LV'].superdata.lv_data.display

        switch (lv_type_input) {
            case 'I':
                proxy[lv_type_input].exp.exp_amount = new Decimal(0)
                proxy[lv_type_input].level.level_amount = proxy[lv_type_input].level.level_amount
                    .add(proxy[lv_type_input].level.level_gain)
            break;

            default:
            break;
        }

        console.log('e')
    },

    LV_level_recalc_I: function() {
        let proxy = player['LV'].superdata.lv_data.display
        let proxy_LOGICAL = player['LV'].superdata.lv_data.logical

        // > G4: 10 * ( ( 2 * ( EXP1 * ( EXP2 ^ LV ) ^ LV ) ) * LV )
        let LOGICAL_calc = new Decimal(10).mul(Decimal.mul(
            Decimal.mul(proxy_LOGICAL['I'].exp_scale.sc_scalar,
                Decimal.pow(Decimal.mul(proxy_LOGICAL['I'].exp_scale.sc_pow_1,
                    Decimal.pow(proxy_LOGICAL['I'].exp_scale.sc_pow_2, proxy['I'].level.level_amount.clampMin(0))),
                proxy['I'].level.level_amount.clampMin(0))),
            proxy['I'].level.level_amount.clampMin(0)))
        proxy['I'].exp.exp_req = LOGICAL_calc
    },

    bars: {
        LV1_BAR: {
            fillStyle: {'background': "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(142,142,142,1) 49.9999%, rgba(213,213,213,1) 50%, rgba(143,143,143,1) 100%)"},
            baseStyle: {'background': "linear-gradient(0deg, rgba(127, 127, 127, 1) 0%, rgba(71, 71, 71, 1) 49.9999%, rgba(106, 106, 106, 1) 50%, rgba(71, 71, 71, 1) 100%)"},
            borderStyle() {
                return {'border-radius': '0px', 'border': '0px'}
            },
            direction: RIGHT,
            width: 501,
            height: 50,
            progress() {
                let lv_proxy = player.LV.superdata.lv_data.display
                return (lv_proxy['I'].exp.exp_amount.div(lv_proxy['I'].exp.exp_req))
            },
            display() {
                let lv_proxy = player.LV.superdata.lv_data.display
                return `<div style="color: #000000">
                <span class="BarInfoLF" style="line-height:15px; font-family: CRDIBold; letter-spacing: 2px">
                LV${formatNoDecimals(lv_proxy['I'].level.level_amount)}<br>
                <span style="font-size: 10px; font-family: CRDILightIT; letter-spacing: normal">+${format(lv_proxy['I'].exp.exp_gain)} EXP / SUCCESSION</span>
                </span>
                <span class="BarInfoRG" style="font-family:CRDIMed"> ${format(lv_proxy['I'].exp.exp_amount)} / ${format(lv_proxy['I'].exp.exp_req)}</span></div>`
            },
            unlocked: true,
        },
    },

    buyables: {
        "XP_RATE_I": {
            cost(x) {
                let PowerI = new Decimal(1.5)
                let Calculation = new Decimal(1).add(Decimal.mul(PowerI, x)).ceil()
                return Calculation;
            },
            buy() {
                player[this.layer].superdata.lv_data.display['I'].level.level_amount = player[this.layer].superdata.lv_data.display['I'].level.level_amount.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                var S = tmp[this.layer].buyables[this.id]
                var SV = player[this.layer].buyables[this.id]
                return `<div style="line-height: 8px">
                <span class="BuyableDataTT">XP Rate T1</span>
                <span class="BuyableDataLT">Level ${format(SV, 0)}</span><br>
                <span style="font-size:9px; font-family:CRDIReg">${format(S.effect)}/s XP Production</span>
                <span style="font-size:9px; font-family:CRDILight">Cost: ${formatNoDecimals(S.cost)} LV</span></div>`
            },
            canAfford() {
                return player[this.layer].superdata.lv_data.display['I'].level.level_amount.gte(this.cost())
            },
            style() {
                const baseStyle = {
                    "width": "250px",
                    "height": "100px",
                    "border-radius": "0px",
                    "border": "0px",
                    "margin-left": "0.5px",
                    "margin-right": "0.5px",
                    "margin-top": "2px"
                }

                if (tmp[this.layer].buyables[this.id].canAfford) {
                    return {
                        ...baseStyle,
                        "background": "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(142,142,142,1) 49.9999%, rgba(213,213,213,1) 50%, rgba(143,143,143,1) 100%)",
                        "color": "#000000"
                    }
                }

                return {
                    ...baseStyle,
                    "background": "linear-gradient(0deg, rgba(127, 127, 127, 1) 0%, rgba(71, 71, 71, 1) 49.9999%, rgba(106, 106, 106, 1) 50%, rgba(71, 71, 71, 1) 100%)",
                    "color": "#ffffff"
                }
            },
            effect(x) {
                let PowerI = new Decimal(5)
                PowerI = PowerI.add(buyableEffect(this.layer, 'XP_RATE_II'))

                let Effect = new Decimal(0).add(Decimal.mul(PowerI, x))
                return Effect
            },
            unlocked() {
                return true
            }
        },
        "XP_RATE_II": {
            cost(x) {
                let PowerI = new Decimal(3)
                let Calculation = new Decimal(1).add(Decimal.mul(PowerI, x)).ceil()
                return Calculation;
            },
            buy() {
                player[this.layer].superdata.lv_data.display['I'].level.level_amount = player[this.layer].superdata.lv_data.display['I'].level.level_amount.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                var S = tmp[this.layer].buyables[this.id]
                var SV = player[this.layer].buyables[this.id]
                return `<div style="line-height: 8px">
                <span class="BuyableDataTT">XP Base T1</span>
                <span class="BuyableDataLT">Level ${format(SV, 0)}</span><br>
                <span style="font-size:9px; font-family:CRDIReg">+${format(S.effect)} to XPR-T1 base</span>
                <span style="font-size:9px; font-family:CRDILight">Cost: ${formatNoDecimals(S.cost)} LV</span></div>`
            },
            canAfford() {
                return player[this.layer].superdata.lv_data.display['I'].level.level_amount.gte(this.cost())
            },
            style() {
                const baseStyle = {
                    "width": "250px",
                    "height": "100px",
                    "border-radius": "0px",
                    "border": "0px",
                    "margin-left": "0.5px",
                    "margin-right": "0.5px",
                    "margin-top": "2px"
                }

                if (tmp[this.layer].buyables[this.id].canAfford) {
                    return {
                        ...baseStyle,
                        "background": "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(142,142,142,1) 49.9999%, rgba(213,213,213,1) 50%, rgba(143,143,143,1) 100%)",
                        "color": "#000000"
                    }
                }

                return {
                    ...baseStyle,
                    "background": "linear-gradient(0deg, rgba(127, 127, 127, 1) 0%, rgba(71, 71, 71, 1) 49.9999%, rgba(106, 106, 106, 1) 50%, rgba(71, 71, 71, 1) 100%)",
                    "color": "#ffffff"
                }
            },
            effect(x) {
                let PowerI = new Decimal(0.25)

                let Effect = new Decimal(0).add(Decimal.mul(PowerI, x))
                return Effect
            },
            unlocked() {
                return player[this.layer].buyables['XP_RATE_I'].gte(5)
            }
        },
    },
    tabFormat: [
    ['raw-html', () => {
        return `
        <div>
        <span></span>
        </div>
      `
    }],
        ['blank'],
        ['bar', 'LV1_BAR'],
        ['blank'],
        ['row', [['buyable', 'XP_RATE_I'], ['buyable', 'XP_RATE_II']]]

    ],
    layerShown(){return true}
})
