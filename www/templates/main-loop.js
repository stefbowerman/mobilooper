<!-- TODO: Get rid of <a> tags, make on click events for <li>s -->
<script type="text/template" id="main-loop">
    <div class="header">
        <h1>Mobilooper</h1>
        <span id="sort-button" class="btn header-button header-button-right">Sort</span>
            <div id="sort-list" class="popdown right" style="display:none">
                <ul>
                    <li id="bpm" class="option selected" data-sort="bpm">BPM</li>
                    <li id="title" class="option" data-sort="title">ABC</li>
                    <li id="favorites" class="option" data-sort="favorites">Favorites</li>
                </ul>
            </div>
    </div>

    <div class="scroll">
        <ul id="loopList" class="tableview tableview-links"></ul>
    </div>
</script>