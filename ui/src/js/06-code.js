// Code functions
document.addEventListener('DOMContentLoaded', function () {
  var ignore = ['gram']
  var copiedText =  'Copied!'

  var cleanCode = function (code) {
    var div = document.createElement('div')
    div.innerHTML = code

    Array.from(div.querySelectorAll('i.conum, b')).map(function (el) {
      div.removeChild(el)
    })

    var cleaner = document.createElement('textarea')
    cleaner.innerHTML = div.innerHTML

    return cleaner.value
  }

  var copyToClipboard = function (code) {
    var textarea = document.createElement('textarea')
    textarea.value = cleanCode(code)
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea)
    textarea.select()

    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  var addCodeHeader = function (pre) {
    var block = pre.querySelector('code')
    var div = pre.parentNode

    var code = block.innerHTML
    var language = block.hasAttribute('class') && block.getAttribute('class').match(/language-([a-z0-9-])+/)[0].replace('language-', '')

    if ( ignore.indexOf(language) > -1 ) return;

    var languageDiv = document.createElement('div')
    languageDiv.className = 'code-language'

    if ( language ) {
      languageDiv.innerHTML = language
    }


    var copyButton = createElement('button', 'btn btn-copy', [document.createTextNode('Copy to Clipboard')])
    copyButton.addEventListener('click', function (e) {
      e.preventDefault()
      copyToClipboard(code)

      var button = e.target
      var text = button.innerHTML
      var width = button.clientWidth

      button.style.width = width + 'px'
      button.classList.add('btn-success')
      button.innerHTML = copiedText

      setTimeout(function() {
        button.innerHTML = text
        button.classList.remove('btn-success')
      }, 1000)
    })

    var children = [languageDiv, copyButton]

    if (language === "cypher") {
      var runButton = createElement('button', 'btn btn-run btn-primary', [document.createTextNode('Run in Browser')])
      runButton.addEventListener('click', function (e) {
        e.preventDefault()

        window.location.href = 'neo4j-desktop://graphapps/neo4j-browser?cmd=edit&arg=' + encodeURIComponent(cleanCode(code))
      })

      children.push(runButton)
    }

    var originalTitle = div.parentNode.querySelector('.title')
    if ( originalTitle ) {
      var titleDiv = document.createElement('div')
      titleDiv.className = 'code-title'
      titleDiv.innerHTML = originalTitle.innerHTML

      originalTitle.style.display = 'none'

      children.unshift(titleDiv)
    }


    var header = createElement('div', 'code-header', children)

    pre.className += ' has-header'
    div.insertBefore(header, pre)
  }

  var createElement = function (el, className, children) {
    var output = document.createElement(el)
    output.setAttribute('class', className)

    Array.isArray(children) && children.forEach(function (child) {
      output.appendChild(child)
    })

    return output
  }

  // Apply Code Headers
  document.querySelectorAll('.highlight')
    .forEach(addCodeHeader)

  if (storageAvailable('sessionStorage')) {
    var sessionStorage = window.sessionStorage
    // sessionStorage.setItem('code_example_language', 'java')
  }
  var storedLanguage = getCodeExampleLanguage()

  var targetActive = 'tabbed-target--active'
  var tabActive = 'tabbed-tab--active'

  var switchTab = function(e) {
    var tab = e.target
    var title = tab.innerHTML

    // Switch Tabs
    var targetTabs = document.querySelectorAll('.tabbed-target[data-lang="'+ title +'"]')
    targetTabs.forEach(function(target) {
      
      // remove all active classes
      target.parentElement.querySelectorAll('.'+ targetActive)
        .forEach(function(el) {
          el.classList.remove(targetActive)
        })

    })

    // add active class for any matching code
    // where matching has the selected language as data-lang
    targetTabs.forEach(function(target) {
        target.classList.add(targetActive)
        target.parentElement.parentElement.querySelectorAll('.'+ tabActive)
          .forEach(function(el) { el.classList.remove(tabActive) })

        target.parentElement.parentElement.querySelectorAll('.tabbed-tab[data-lang="'+ title +'"]')
          .forEach(function(el) { el.classList.add(tabActive) })
      })

      if (storageAvailable('sessionStorage')) {
        sessionStorage.setItem('code_example_language', title)
      }

      var offset = document.querySelector('.navbar').offsetHeight + document.querySelector('.toolbar').offsetHeight + 100

      var bodyRect = document.body.getBoundingClientRect().top;
      var elementRect = tab.getBoundingClientRect().top;
      var elementPosition = elementRect - bodyRect;
      var offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
  }

  // Tabbed code
  Array.from(document.querySelectorAll('.tabs, .tabbed-example'))
    .forEach(function(tab) {
      console.log(tab)
      var tabsTitle = tab.querySelector('.title')
      var originalTab = tab
      var parent = tab.parentElement

      // Build an array of elements
      var elements = []

      // add codeblocks from driver manual html output format
      tab.querySelectorAll('.listingblock').forEach(function(block) {
        if ( block.querySelector('code') ) {
          elements.push(block)
        }
      })
      
      // hack - assumes labs formatting if adding codeblocks above did nothing
      if ( elements.length <= 1 ) {
        elements = [tab]
        var drivers = false
      } else {
        var drivers = true
      }

      // Loop through the next sibling until it doesn't contain a <code> tag
      while (tab) {
        var nextTab = tab.nextElementSibling

        if ( nextTab && nextTab.querySelector('code') ) {
          elements.push(nextTab)
          tab = nextTab
        }
        else {
          tab = false
        }
      }

      // Don't do anything if there's only one tab
      if ( elements.length <= 1 ) {
        return;
      }

      var tabbedContainer = createElement('div', 'tabbed-container', [])
      var tabbedParent = createElement('div', 'tabbed', [tabbedContainer])

      if (tabsTitle) { 
        parent.insertBefore(tabsTitle, originalTab)
      }
      parent.insertBefore(tabbedParent, originalTab)

      // Build up tabs
      var langList = []
      var tabs = elements.map(function(element) {
        var title = element.querySelector('.title')
        var tabText = element.querySelector('.code-language').innerHTML
        
        var text = title ? title.innerHTML : tabText

        var tabElement = createElement('li', 'tabbed-tab', [ document.createTextNode(tabText) ])

        element.dataset.title = text
        element.dataset.lang = tabText
        tabElement.dataset.title = text
        tabElement.dataset.lang = tabText

        if (tabText == storedLanguage) tabElement.classList.add(tabActive)
        tabElement.addEventListener('click', switchTab)

          
        // don't want more than one tab for the same lang
        if (!langList.includes(tabText)) {
          langList.push(tabText)
        } else {
          tabElement.classList.add('tabbed-tab--dupe')
          tabElement.classList.remove(tabActive)
        }
        return tabElement
        
      })

      // Remove elements from parent and add to tab container
      var activeAdded = false
      elements.forEach(function(element) {
        tabbedContainer.appendChild(element)
        element.classList.add('tabbed-target')
        if (element.getAttribute('data-lang') == storedLanguage) {
          element.classList.add('tabbed-target--active')
          // console.log(element.parentElement)
          activeAdded = true
        }
      })
      
      if (!activeAdded) {

        // get the data-lang of the first tab
        var setLang = elements[0].getAttribute('data-lang')
        // add active to matching tabs and targets
        var elIndex = 0
        elements.forEach(function(element) {
          if (element.getAttribute('data-lang') == setLang) {
            element.classList.add('tabbed-target--active')
            tabs[elIndex].classList.add('tabbed-tab--active')
          }
          elIndex++

        })
      }
      
      tabbedParent.insertBefore( createElement('ul', 'tabbed-tabs', tabs), tabbedContainer )

      if (drivers) parent.removeChild(originalTab)

    })

    function storageAvailable (type) {
      try {
        var storage = window[type]
        var x = '__storage_test__'
        storage.setItem(x, x)
        storage.removeItem(x)
        return true
      } catch (e) {
        return false
      }
    }
  
    function getCodeExampleLanguage () {
      return storageAvailable('sessionStorage') ? sessionStorage.getItem('code_example_language') || false : false
    }
  
})