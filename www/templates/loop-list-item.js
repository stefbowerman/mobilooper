<script type="text/template" id="loop-list-item">
    <a id="<%= id %>" class="loop-list-item-holder clearfix" data-loop="<%= id %>">
        <!-- span class="star <% if (_.contains(store.get('favorites'), id)) { %>favorite<% } %>" data-loop="<%= id %>">&#9733;</span -->
        <img src="<%= img %>"/>
        <div class="rowdata" data-loop="<%= id %>">
            <div class="meta-data left <% if(!artist){ %>no-artist<% } %>">
                <span class="title"><%= title %></span>
                <% if(artist){ %>
                    <br />
                    <span class="quiet small"><%= artist %></span> 
                <% } %>
            </div> 
            <div class="right bpm">
                <%= bpm %>
            </div>
        </div>
    </a>
</script>