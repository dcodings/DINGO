let ShEx = require('shex-next')
let ShExHTML = require('shex-html')
let marked = require('marked')
let $ = require('jquery')
let schema = 'DINGO.shex'

function component() {
  let section = '#allEntities'
  // let section = '#Grant'
  let messages = $("<p/>").text("loaded").appendTo(section);
  let render = $("<div/>");
  $("<button/>").text("add").appendTo(section).on('click', load);
  $("<button/>").text("remove").appendTo(section).on('click', () => render.empty());
  render.appendTo(section)
  let base = $('<a/>', {href: "DINGO.shex"}).get(0).href
  let shexml = ShExHTML($, marked)

  function load () {
    fetch(schema).then(function(response) {
      response.text().then(function(text) {
        let a = $('#toc li a[href$="#Entities"]')
        let secno = a.find('span').text()
        let tocEntry = $('<ol/>', {class: 'toc'}).appendTo(a.parent())
        let shexParser = ShEx.Parser.construct(base)
        try {
          messages.removeClass('error').empty()
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
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = ['Hello', '--', 'webpack', ShEx].join(' ');
  console.log("HERE");
  return element;
}

function XMLescape (utils, content, url) {
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.body.appendChild(component());
