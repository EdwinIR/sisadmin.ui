/**
 * Bootstrap Table <Language> translation
 * Author: Your Name <your@email>
 */
(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        formatLoadingMessage: function() {
            return 'Cargando, espere por favor…';
        },
        formatRecordsPerPage: function(pageNumber) {
            return pageNumber + ' registros por página';
        },
        formatShowingRows: function(pageFrom, pageTo, totalRows) {
            return 'Mostrando ' + pageFrom + ' a ' + pageTo + ' de ' + totalRows + ' registros' ;
        },
        formatSearch: function() {
            return 'Buscar'
        },
        formatNoMatches: function() {
            return 'No se encontró nigún registro que coincida con la búsqueda';
        }
    });
})(jQuery);