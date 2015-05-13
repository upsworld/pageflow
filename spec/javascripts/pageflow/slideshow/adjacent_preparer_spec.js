describe('pageflow.AdjacentPreparer', function() {
  var p = pageflow;

  describe('#prepareAdjacent', function() {
    it('calls prepare for adjacent pages', function() {
      var page = {id: 'current'};
      var adjacentPage = {prepare: sinon.spy()};
      var adjacentPages = fakeAdjacentPages([page, [adjacentPage]]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(page);

      expect(adjacentPage.prepare).to.have.been.called;
    });

    it('does not call prepare for previously prepared pages which are also adjacent of current page', function() {
      var lastPage = {id: 'last'};
      var page = {id: 'current'};
      var commonAdjacentPage = {prepare: sinon.spy(), unprepare: sinon.spy()};
      var adjacentPages = fakeAdjacentPages([lastPage, [commonAdjacentPage]],
                                            [page, [commonAdjacentPage]]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(lastPage);
      adjacentPreparer.prepareAdjacent(page);

      expect(commonAdjacentPage.prepare).to.have.been.calledOnce;
    });

    it('calls unprepare for previously prepared pages which are not adjacent of current page', function() {
      var lastPage = {id: 'last'};
      var page = {id: 'current'};
      var adjacentPageOfLastPage = {prepare: sinon.spy(), unprepare: sinon.spy()};
      var adjacentPages = fakeAdjacentPages([lastPage, [adjacentPageOfLastPage]],
                                            [page, []]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(lastPage);
      adjacentPreparer.prepareAdjacent(page);

      expect(adjacentPageOfLastPage.unprepare).to.have.been.called;
    });

    it('does not call unprepare for previously prepared pages which are also adjacent of current page', function() {
      var lastPage = {id: 'last'};
      var page = {id: 'current'};
      var commonAdjacentPage = {prepare: sinon.spy(), unprepare: sinon.spy()};
      var adjacentPages = fakeAdjacentPages([lastPage, [commonAdjacentPage]],
                                            [page, [commonAdjacentPage]]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(lastPage);
      adjacentPreparer.prepareAdjacent(page);

      expect(commonAdjacentPage.unprepare).not.to.have.been.called;
    });

    it('does not call unprepare for previously prepared pages has become current page', function() {
      var lastPage = {id: 'last'};
      var page = {prepare: sinon.spy(), unprepare: sinon.spy()};
      var adjacentPages = fakeAdjacentPages([lastPage, [page]],
                                            [page, []]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(lastPage);
      adjacentPreparer.prepareAdjacent(page);

      expect(page.unprepare).not.to.have.been.called;
    });
  });

  function fakeAdjacentPages(/* pairs */) {
    var pairs = arguments;
    var stub = sinon.stub();

    _(pairs).each(function(pair) {
      var page = pair[0];
      var adjacentPages = pair[1];

      stub.withArgs(page).returns(adjacentPages);
    });

    return {of: stub};
  }
});