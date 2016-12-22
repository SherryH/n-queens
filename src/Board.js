// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // console.log('this:', this);
      // console.log('rowIndex: ', rowIndex);
      // console.log('attributes: ', this.attributes);
      var result = this.get(rowIndex).reduce(function(pre,cur){
        return pre+cur;
      });
      if (result > 1) { return true;}

      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (var i = 0; i < this.get('n'); i++){
        var result = this.get(i).reduce(function(pre,cur){
          return pre+cur;
        });
        if (result > 1) { return true;}
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var sum = 0;
      for (var i = 0; i < this.get('n'); i++) {
        sum += this.get(i)[colIndex];
      }
      return sum > 1 ? true : false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var sum = 0, n = this.get('n');
      for (var column = 0; column < n; column++) {
        sum = 0;
        for (var row = 0; row < n; row++) {
          sum += this.get(row)[column];
        }
        if (sum > 1) {return true;}
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // console.log('majorDiagonalColumnIndexAtFirstRow', majorDiagonalColumnIndexAtFirstRow);
      // console.log('Attributes', this);
      var n = this.get('n');
      var mdc = majorDiagonalColumnIndexAtFirstRow;
      // console.log('COLUMN INDEX AT FIRST ROW', mdc);

      // for (var i = 0 ; i < n; i++) { //first go through all the rows

      // }

      var row = 0; //start at the irst row
      var column = mdc; // start at the diagonal column

      if (mdc > 0) {
        var sum = 0;
        while((row < n) && (column < n)){
          sum+=this.get(row)[column]; //sum things diagonally
          row++;
          column++;
        }
      } else {
        while (column < 0) { //incrementing the position until we are on the board with column index >0
          column++;
          row++;
        }

        var sum = 0;

        while((row < n) && (column < n)){
          sum+=this.get(row)[column]; //sum things diagonally
          row++;
          column++;
        }
      }

      return sum > 1 ? true : false; //check if negative 1

      //return false;




      /*

      Left to Right

      return colIndex - rowIndex;


      col

      [1, 0, 0, 0] row1 - location of queen is 0
      [0, 0, 0, 0] row2
      [0, 0, 1, 0] row3 - location of queen is 2
      [0, 0, 0, 0] row4

      indexOf(1) === 1
      indexOf(2) === -1
      indexOf(3) === 3

      if (indexOf(1) - indexOf(3) equals difference between row3 and row1)

      [0, 0, 0, 0]
      [1, 0, 0, 0]
      [0, 0, 0, 0]
      [0, 0, 1, 0]

      if

       */
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //test the big top right triangle
      var row, sum, innerCol;
      var n = this.get('n');
      for (var column = -(n-2); column < n; column++){ //check through the first row
        row = 0;
        sum = 0;
        innerCol = column;
        while(innerCol < 0){
          innerCol++;
          row++;
        }
        while (row < n && innerCol < n){
          sum += this.get(row)[innerCol];
          // console.log('[row,innerCol]: ',row,", ",innerCol);
          // console.log('sum: ',sum);
          row++;
          innerCol++;
        }
        if (sum>1) {return true;}
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
       // console.log('majorDiagonalColumnIndexAtFirstRow', majorDiagonalColumnIndexAtFirstRow);
      // console.log('Attributes', this);
      var n = this.get('n');
      var mdc = minorDiagonalColumnIndexAtFirstRow; //colInd-rowInd
      // console.log('COLUMN INDEX AT FIRST ROW', mdc);

      // for (var i = 0 ; i < n; i++) { //first go through all the rows

      // }

      var row = 0; //start at the irst row
      var column = mdc; // start at the diagonal column

      if (mdc < n) {
        var sum = 0;
        while((row < n) && (column >= 0)){
          sum+=this.get(row)[column]; //sum things diagonally
          row++;
          column--;
        }
      } else {
        while (column >= n) { //incrementing the position until we are on the board with column index >0
          column--;
          row++;
        }

        var sum = 0;

        while((row < n) && (column >= 0)){
          sum+=this.get(row)[column]; //sum things diagonally
          row++;
          column--;
        }
      }

      return sum > 1 ? true : false; //check if negative 1

      //return false;

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      //test the big top right triangle
      var row, sum, innerCol;
      var n = this.get('n');
      for (var column = (n-1)*2; column >= 0; column--) { //check through the first row
        row = 0;
        sum = 0;
        innerCol = column;
        while(innerCol >= n) {
          innerCol--;
          row++;
        }
        while (row < n && innerCol >= 0){
          sum += this.get(row)[innerCol];
          // console.log('[row,innerCol]: ',row,", ",innerCol);
          // console.log('sum: ',sum);
          row++;
          innerCol--;
        }
        if (sum>1) {return true;}
      }
      return false; // fixme

    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
