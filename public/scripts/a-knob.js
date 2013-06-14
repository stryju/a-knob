var aKnob = ( function ( doc, undefined ) {
  'use strict';

  function $( selector ) {
    return doc.querySelectorAll( selector );
  }

  function attr( el, attribute, val ) {
    if ( val !== undefined ) {
      return el.setAttribute( attribute, val );
    }

    return el.getAttribute( attribute );
  }

  function on( el, evs ) {
    Object.keys( evs ).forEach( function ( ev ) {
      ev.split( ' ' ).forEach( function ( splitEv ) {
        el.addEventListener( splitEv, evs[ ev ] );
      });
    });
  }

  function inCircle( p, r ) {
    var x = ( r - p.x );
    var y = ( r - p.y );

    return ( x * x ) + ( y * y ) <= r * r;
  }

  function getEventPoint( ev, el ) {
    var evX = ev.clientX;
    var evY = ev.clientY;

    if ( ev.touches && ev.touches.length ) {
      evX = ev.touches[ 0 ].clientX;
      evY = ev.touches[ 0 ].clientY;
    }

    return {
      x : evX + ( doc.body.scrollLeft || 0 ) - el.offsetLeft,
      y : evY + ( doc.body.scrollTop  || 0 ) - el.offsetTop
    };
  }

  function getDeg( p, r ) {
    var a = r - p.x;
    var b = r - p.y;
    var c = Math.sqrt( a * a + b * b );

    if ( b < 0 ) {
      a = -a;
    }

    var deg = Math.asin( a / c ) * ( 180 / Math.PI );

    if ( b < 0 ) {
      deg += 180;
    }

    return Math.max( 0, Math.min( 225, deg ) );
  }

  function roundValue( min, max, step, prc ) {
    return ~~ ( ( min + ( max - min ) * prc ) / step ) * step;
  }

  function turnTheKnob( el, deg ) {
    if ( ! el ) {
      return false;
    }

    var transform = 'translateZ( 0 ) rotate( ' + -deg + 'deg )';

    [ 'webkitT', 'mozT', 'msT', 'oT', 't' ].forEach( function ( prefix ) {
      el.style[ prefix + 'ransform' ] = transform;
    });
  }

  function isDragged( el, is ) {
    if ( is ) {
      el.classList.add( 'dragged' );
    } else {
      el.classList.remove( 'dragged' );
    }
  }

  function add( el ) {
    var $input     = el.querySelector( '.a-knob-input' );
    var $indicator = el.querySelector( '.a-knob-indicator' );

    var min  = parseInt( attr( $input, 'min' ), 10 )  || 0;
    var max  = parseInt( attr( $input, 'max' ), 10 )  || 100;
    var step = parseInt( attr( $input, 'step' ), 10 ) || 1;

    var r = el.offsetWidth * 0.5;

    var pressed = false;

    function inputChange( ev ) {
      // ev.target.value;

      var val = Math.max( min, Math.min( max, ev.target.value ) );
      var prc = ( val - min ) / ( max - min );

      turnTheKnob( $indicator, 225 - 225 * prc );
    }

    function pointerChange( ev ) {
      var p = getEventPoint( ev, el );

      // input - ignore
      if ( /input/i.test( ev.target.nodeName )) {

        ev.stopPropagation();
        ev.stopImmediatePropagation();

        ev.target.focus();
        return ev;
      }

      // outside the circle, - ignore
      if ( ! inCircle( p, r ) ) {
        return ev;
      }

      ev.preventDefault();

      var deg = getDeg( p, r );

      turnTheKnob( $indicator, deg );
      attr( $input, 'value', roundValue( min, max, step, ( 225 - deg ) / 225 ) );
    }

    inputChange({
      target : $input
    });

    on( $input, {
      'blur keyup' : inputChange
    });

    on( el, {
      click                  : pointerChange,
      'mousedown touchstart' : function ( ev ) {
        var p = getEventPoint( ev, el );

        // outside the circle, - ignore
        if ( ! inCircle( p, r ) ) {
          return ev;
        }

        ev.preventDefault();
        pressed = true;
        isDragged( $indicator, true );
      },
      'mouseup touchend' : function ( ev ) {
        pressed = false;
        isDragged( $indicator, false );
        pointerChange( ev );
      },
      'mousemove touchmove' : function ( ev ) {
        if ( pressed ) {
          ev.preventDefault();
          pointerChange( ev );
        }
      }
    });
  }

  return function ( selector ) {
    [].forEach.call( $( selector ),  function ( el ) {
      return add( el );
    });
  };

})( document );

aKnob( '.a-knob' );


