
const renameLabels = {
    'apoc-core': 'APOC Core',
    'apoc-full': 'APOC Full',
    'na': 'N / A',
    'warning': 'Warning!',
    'danger': 'Danger!',
    'mac-os': 'Mac OS',
    'cluster-member-core': 'CORE',
    'cluster-member-read-replica': 'READ_REPLICA',
    'cluster-member-single': 'SINGLE',
}

module.exports.register = function(registry, context) {
    registry.inlineMacro('label', function () {
        const self = this

        self.process(function(parent, target) {
            let text = (renameLabels[ target ] || target)
                .split(/\s|-/)
                .map(text => text.substr(0, 1).toUpperCase() + text.substr(1))
                .join(' ')

            return `<span class="label label--${target}">${text}</span>`
        })
    })
}
