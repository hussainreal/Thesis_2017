#!/bin/bash

curl -i -H "Content-Type: application/json" -X POST -d '{"public_key": {"g": "117724361726052232286642729503619885226396848298440290194474368106181877843301454349676344086382538003780399137832758867778222252201458886767547437337543045586657569159374425258039121862112545733028126116907766250403035801176460752912327774508255666696312630982168986041970059274372378012061526901950296772972", "n": "117724361726052232286642729503619885226396848298440290194474368106181877843301454349676344086382538003780399137832758867778222252201458886767547437337543045586657569159374425258039121862112545733028126116907766250403035801176460752912327774508255666696312630982168986041970059274372378012061526901950296772971",  "n_sq": "13859025343806391724289012340636007517856812470399552782849410723186738408224943862229045082026573808542645768813291683672590022400753770597376594265425755418649862946024287446851755443281965084202056749045569931049723621466662928679048901126827007182697456876001147891347861597443262827607112497890231245296538525850468305542969877113479098725813447056986973977116083993580657945506068423608861988928447530897456275846901311444559511555664329390030863183440666969381620083548841652072533980932901680931325634535476046500260807848129059854742673946241513261640462679464533013836908596029514060149476342461096316166841"}, "number": 5 }' http://localhost:5000/encrypt

