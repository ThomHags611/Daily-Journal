
$(document).ready(function() {
    function loadJournalEntries(){
        $.get('http:/journal', function(entries){
            $('#journal-list').empty();
            entries.forEach(function(entry){
                $("#journal-list").append(`
                    <li class="flex justify-between data-id="${entry.id}">
                        <div class="entry">
                            <strong>${entry.date}</strong>: ${entry.content}
                        </div>  
                        <div class = "buttons">
                            <button class = "edit-btn">Edit</button>
                            <button class = "delete-btn text-red-500">Delete</button>
                        </div>
                    </li>
                `);
            });
        }); 
    }

    loadJournalEntries();

    $("#journal-form").on('submit', function(e){
        e.preventDefault();
        const newEntry = {
            date: $("#date").val(), 
            content: $("#content").val(), 
        }

        $.ajax({
            url: '/journal', 
            method: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify(newEntry), 
            success:function(){
                loadJournalEntries();
                $("#journal-form")[0].reset();
            }
        })
    })

    $(document).on('click', '.edit-btn', function(){
        const li = $(this).closest('li');
        const entryId = li.attr('data-id');
        const newDate = prompt("Enter new Date: ", li.find('strong').text());
        const newContent = prompt("Enter new content: ", li.contents().filter(function(){return this.nodeType ===3;}).text().trim())

        if(newDate && newContent){
            $.ajax({
                url: '/journal/' + entryId, 
                method: 'PUT', 
                contentType: 'application/json', 
                data: JSON.stringify({date: newDate, content: newContent}), 
                success: function(){
                    loadJournalEntries();
                }
            })
        }
    })

    $(document).on('click', '.delete-btn', function(){
        const entryId = $(this).closest('li').attr('data-id');
        console.log(entryId)
        if(confirm('Are you sure you want to delete this entry?')){
            $.ajax({
                url:'/journal/' + entryId, 
                method: 'DELETE', 
                success: function(){
                    loadJournalEntries();
                }
            })
        }
    })
});