<script type="text/template" id="loop-detail">
        <div class="header">
            <span id="back" class="btn header-button header-button-left">Back</span>
            <h1>Mobilooper</h1>
            <span id="favorite" class="btn header-button header-button-right star <% if (_.contains(store.get('favorites'), id)) { %>favorite<% } %>" data-loop="<%= id %>">
                &#9733;
            </span>
        </div>

        <div class="scroll clearfix">
            <!-- iPod style -->
            <div id="sort-options" class="clearfix small" style="text-align:center">
                    <div>
                        Title : <%= title %>
                    </div>
                    <% if(artist){ %>
                        <div>
                            Artist : <%= artist %>
                        </div>
                    <% } %>
                    <div>
                        BPM : <%= bpm %>
                    </div>
            </div>
            <center><img src="<%= img %>" style="width:95%"/></center>
            <div style="width:100%">
                <div style="text-align:center">
                    <div id="audio_position" style="height:10px;background:red"></div>
                    <span id="play" class="btn" style="width:30%;padding-top:10px;padding-bottom:10px;color:blue">PLAY</span>
                    <span id="stop" class="btn" style="width:30%;padding-top:10px;padding-bottom:10px;color:red">STOP</span>
                    <span class="btn" style="display:none;width:10%;padding-top:10px;padding-bottom:10px;">
                        <span class="star <% if (_.contains(store.get('favorites'), id)) { %>favorite<% } %>" data-loop="<%= id %>">&#9733;</span>
                    </span>
                </div>
            </div>
        </div>

<!--
        <div>
            <div class="left" style="width:49%; text-align:center">
                <img src="<%= img %>" class="left" style="width:100px; margin:auto"/>
            </div>
            <div style="width:50%; display:inline-block">
                <div>
                    Title : <%= title %>
                </div>
                <% if(artist){ %>
                    <div>
                        Artist : <%= artist %>
                    </div>
                <% } %>
                <div>
                    BPM : <%= bpm %>
                </div>
            </div>
        </div>
        <div style="clear:both" />
        <hr />
        <div style="width:100%">
            <span class="star <% if (_.contains(store.get('favorites'), id)) { %>favorite<% } %>" data-loop="<%= id %>">&#9733;</span>
            <div style="text-align:center">
                <span id="play" class="btn" style="width:35%;padding-top:20px;padding-bottom:20px;color:blue">PLAY</span>
                <span id="stop" class="btn" style="width:35%;padding-top:20px;padding-bottom:20px;color:red">STOP</span>
            </div>
        </div>
    -->
    </script>