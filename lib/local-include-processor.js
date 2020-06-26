module.exports = function () {
    this.includeProcessor(function () {
      this.$option('position', '>>')
      this.handles((target) => !target.startsWith('https://') && target.endsWith('.adoc'))
      this.process((doc, reader, target, attrs) => {
        if ( target.startsWith('./') ) target = target.substr(2)

        const contents = require('fs').readFileSync([process.cwd(), doc.attributes.$$smap['page-origin-start-path'], reader.dir, target].join('/')).toString()
        reader.pushInclude(contents, target, target, 1, attrs)
      })
    })
  }
