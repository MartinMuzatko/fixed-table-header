import Waypoint from '../../node_modules/waypoints/lib/noframework.waypoints'

export default class ScrollTable {
    constructor(element, settings) {
        this.element = $(element)
        this.settings = {
            offset: $('.header')[0].offsetHeight,
            resize: true
        }
        if (this.element.length) {
            this.thead = this.element.find('th').parent()
            this.fixedThead = []
            this.setupWaypoints()
            if (this.settings.resize) {
                this.setupResize()
            }
        }
    }

    setupWaypoints() {
        new window.Waypoint({
            element: this.element[0],
            offset: this.settings.offset,
            handler: (direction) => {
                if (direction == 'down') {
                    this.scrollIntoView()
                } else {
                    this.cleanUp()
                }
            }
        })
        new window.Waypoint({
            element: this.element.find('tr:last-child')[0],
            offset: 100,
            handler: (direction) => {
                if (direction == 'up') {
                    this.scrollIntoView()
                } else {
                    this.cleanUp()
                }
            }
        })
    }

    setupResize() {
        this.resizeTimer = 0
        $(window).on('resize', (e) => {

            clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(() => {
                if (this.fixedThead.length) {
                    this.cleanUp()
                    this.scrollIntoView()
                }
            }, 250)

        })
    }

    scrollIntoView() {
        this.fixedThead = this.thead.clone().insertBefore(this.thead)
        this.row = $(this.element.find('tr')[1]).children()

        this.fixedThead.find('th').each((index, item) => {
            $(item).css({
                width: this.row[index].offsetWidth
            })
        })

        this.fixedThead.css({
            position: 'fixed',
            top: this.settings.offset,
            left: this.element[0].offsetLeft,
            width: this.element[0].offsetWidth,
            'z-index': 100,
        })
    }

    cleanUp() {
        if (this.fixedThead.length) {
            this.fixedThead.remove()
            this.fixedThead = []
        }
    }
}
