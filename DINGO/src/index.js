let ShEx = require('shex-next')
let ShExHTML = require('shex-html')
let marked = require('marked')
let $ = require('jquery')

function component() {
  loadSchema('DINGO.shex', '#allEntities', '#Entities')
  loadOntology('DINGO-OWL.ttl', '#allProperties', '#Properties')
}

function loadSchema (schemaURL, section, sectionAnchor) {
  // let section = '#Grant'
  let base = $('<a/>', {href: 'DINGO.shex'}).get(0).href

  
  let messages = $('<p/>').text('ready').appendTo(section);
  let render = $('<div/>');
  let button = $('<button/>').text('generate').appendTo(section).on('click', toggleSchema);
  render.appendTo(section)
  let shexml = ShExHTML($, marked)
  let tocEntry

  function toggleSchema () {
    if (button.text() === 'remove') {
      button.text('regenerate')
      render.empty()
      tocEntry.empty()
      messages.removeClass('error').text('removed')
      return
    }
    button.text('remove')
    fetch(schemaURL).then(function(response) {
      response.text().then(function(text) {
        let tocLink = $('#toc li a[href$="'+sectionAnchor+'"]')
        let secno = tocLink.find('span').text()
        tocEntry = $('<ol/>', {class: 'toc'}).appendTo(tocLink.parent())
        let shexParser = ShEx.Parser.construct(base)
        try {
          messages.removeClass('error').text('generated')
          // let schema = ShEx.Util.AStoShExJ(shexParser.parse(text))
          let schema = JSON.parse(JSON.stringify(shexParser.parse(text)).replace(/(http[^"]+)Shape/g, '$1'))

          // delete schema.base // we don't want to see this stuff.
          // delete schema.prefixes

          render.append(
            // shexml.asTree(schema, base)
            Object.keys(schema.shapes).map((shapeLabel, idx) => {
              let ret = shexml.asTree(schema, base + '#', shapeLabel)
              let heading = ret.find('h3').attr('id')
              tocEntry.append(
                $('<li/>', {class: 'tocline'})
                  .append($('<a/>', {href: heading, class: 'tocxref'}).append(
                    $('<span/>', {class: 'secno'}).text(secno + '.' + (idx + 1)),
                    heading
                  ))
                // <li class="tocline"><a href="#Grant" class="tocxref"><span class="secno">9.4.1 </span>Grant</a></li>
              )
              return ret
            })
          )
        } catch (error) {
          if ('lineNo' in error) {
            $('<button/>').text('go to').addClass('goto').appendTo(messages).on('click', evt => {
              let t = ta.get(0)
              t.scrollTo(0, 16 * (error.lineNo - 1))
              console.log(t.selectionStart, t.selectionEnd)
              t.setSelectionRange(error.offset - 1, error.offset + error.width)
              console.log(t.selectionStart, t.selectionEnd)
            })
            console.warn(error.offset, error.offset + 1 + error.width)
          }
          $('<pre/>').text(error).addClass('error').appendTo(messages)
        }
      });
    });
  }
  return null;
}

function loadOntology (ontologyURL, section, sectionAnchor) {
  // let section = '#Grant'
  let base = $('<a/>', {href: 'DINGO.shex'}).get(0).href

  
  let messages = $('<p/>').text('ready').appendTo(section);
  let render = $('<div/>');
  let button = $('<button/>').text('generate').appendTo(section).on('click', toggleOntology);
  render.appendTo(section)
  let shexml = ShExHTML($, marked)
  let tocEntry

  function toggleOntology () {
    if (button.text() === 'remove') {
      button.text('regenerate')
      render.empty()
      tocEntry.empty()
      messages.removeClass('error').text('removed')
      return
    }
    button.text('remove')
    fetch(ontologyURL).then(function(response) {
      response.text().then(function(text) {
        let tocLink = $('#toc li a[href$="'+sectionAnchor+'"]')
        let secno = tocLink.find('span').text()
        tocEntry = $('<ol/>', {class: 'toc'}).appendTo(tocLink.parent())
        let n3Parser = ShEx.N3.Parser({documentURI: base})
        try {
          messages.removeClass('error').text('generated')
          // let ontology = ShEx.N3.Store()
          // ontology.addTriples(n3Parser.parse(text))
          let ontology = n3Parser.parse(text)

          // delete ontology.base // we don't want to see this stuff.
          // delete ontology.prefixes

          render.append(
            // shexml.asTree(ontology, base)
            ontology.filter(t => t.predicate === 'http://www.w3.org/2000/01/rdf-schemalabel').map((t, idx) => {
            // ontology.getTriplesByIRI(null, 'http://www.w3.org/2000/01/rdf-schema#label', null).map((t, idx) => {
              let ret = $('<section/>').append(
                $('<h3/>').text(t.subject),
                $('<p/>').text(t.object)
              )
              let heading = t.subject
              tocEntry.append(
                $('<li/>', {class: 'tocline'})
                  .append($('<a/>', {href: heading, class: 'tocxref'}).append(
                    $('<span/>', {class: 'secno'}).text(secno + '.' + (idx + 1)),
                    heading
                  ))
                // <li class="tocline"><a href="#Grant" class="tocxref"><span class="secno">9.4.1 </span>Grant</a></li>
              )
              return ret
            })
          )
        } catch (error) {
          if ('lineNo' in error) {
            $('<button/>').text('go to').addClass('goto').appendTo(messages).on('click', evt => {
              let t = ta.get(0)
              t.scrollTo(0, 16 * (error.lineNo - 1))
              console.log(t.selectionStart, t.selectionEnd)
              t.setSelectionRange(error.offset - 1, error.offset + error.width)
              console.log(t.selectionStart, t.selectionEnd)
            })
            console.warn(error.offset, error.offset + 1 + error.width)
          }
          $('<pre/>').text(error).addClass('error').appendTo(messages)
        }
      });
    });
  }
  return null;
}

function XMLescape (utils, content, url) {
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.body.appendChild(component());
