let unique_id = 1
let path = ''
let take = 24
let isFetchingData = false;
let total_items = 48
let selected_photo = {}
let is_allow_multiple = true
let input_target = `#media-library-image-input_${unique_id}`
let display_target = `#media-library-preview-small-img_${unique_id}`
let type = 'simple'
let display_column = 3

let get_route_element = $(`#get_routes`)
let get_media_library_route = get_route_element.data('get_media_library')
let create_new_directory_route = get_route_element.data('create_new_directory')
let upload_media_library_route = get_route_element.data('upload_media_library')
let delete_media_library_route = get_route_element.data('delete_media_library')
let temp_display_column = get_route_element.data('display_column')
if (temp_display_column) {
    display_column = temp_display_column
}

$(`.media-library-upload-container`).on('click', function () {
    $(this).siblings('.expendable-area').slideToggle(200)
    setTimeout(() => {
        if ($(this).siblings('.expendable-area').is(':hidden')) {
            $(this).children('.fa-plus').css('transform', 'rotate(0deg)')
        } else {
            $(this).children('.fa-plus').css('transform', 'rotate(45deg)')
        }
    }, 250)
})

const set_input_field_data = () => {
    let values = ``
    selected_photo[unique_id]?.map((item, index) => {
        if (index == 0) {
            values += item.name
        } else {
            values += ' , ' + item.name
        }
    })
    // $(input_target).val(values);
    document.getElementById(input_target).value = values;
}

const set_preview_image = () => {
    let html = ``
    selected_photo[unique_id]?.map((item, index) => {
        html += `<div class="col-md-${display_column} mb-4">
                  <div class="preview-image-container">
                    <div class="preview-image-container-action">
                        <button type="button" data-photo-id="${item.id}" data-photo-name="${item.name}" data-photo-url="${item.url}" class="btn btn-sm btn-danger media-library-image-select"><i class="fa-solid fa-xmark"></i></button>
                        <button type="button" data-photo-id="${item.id}" data-photo-name="${item.name}" data-photo-url="${item.url}" class="btn btn-sm btn-info mx-1 media-library-image-large-preview"><i class="fa-solid fa-eye"></i></button>
                    </div>
                    <img data-photo-id="${item.id}"  data-photo-name="${item.name}" class="img-thumbnail media-library-image-preview mb-4 " src="${item.url}" alt="loader">
                </div>
            </div>`
    })

    // $(display_target).html(html)
    document.getElementById(display_target).innerHTML = html;
}

const set_preview_image_extended = () => {
    //table col1=image, col2=input, col3=delete
    let html = ``
    selected_photo[unique_id]?.map((item, index) => {
        html += `<div class="col-md-${display_column}">
                    <table class="table table-bordered w-100">
                        <tr>
                            <td class="text-center" style="width:260px;">
                                <img data-photo-id="${item.id}" data-photo-name="${item.name}" class="img-thumbnail media-library-image-preview my-2" src="${item.url}" alt="loader" style="width:240px;">
                            </td>
                            <td>
                                <div class="row">
                                    <div class="col-md-4">
                                        <label class="text-start">Sort Order</label>
                                        <input type="text" class="form-control" placeholder="Sort order" value="${index + 1}" name="image_sort_order[]">
                                    </div>
                                    <div class="col-md-8">
                                        <label class="text-start">Title</label>
                                        <input type="text" class="form-control" placeholder="Title" name="image_title[]">
                                    </div>
                                </div>
                            </td>
                            <td style="width:120px;">
                            <div class="d-flex align-items-center justify-content-center gap-2 mt-3">
                                <button type="button" data-photo-id="${item.id}" data-photo-name="${item.name}" data-photo-url="${item.url}" class="btn btn-sm btn-info mx-1 media-library-image-large-preview"><i class="fa-solid fa-eye"></i></button>

                                <button type="button" data-photo-id="${item.id}" data-photo-name="${item.name}" data-photo-url="${item.url}" class="btn btn-sm btn-danger media-library-image-select"><i class="fa-solid fa-trash"></i></button>
                            </div>
                            </td>
                        </tr>
                    </table>
                </div>
                `
    })

    // $(display_target).html(html)
    document.getElementById(display_target).innerHTML = html;
}


const checkSelected = (id) => {
    let selected = ''
    let containsId = selected_photo[unique_id]?.some(item => item.id === id);
    if (containsId) {
        selected = 'selected-photo'
    }
    return selected
}

const get_media_library = (route, config) => {
    axios.post(route, config).then(function (response) {
        isFetchingData = false
        total_items = parseInt(response.data.data.media_count)
        $(`#loader_${unique_id}`).fadeOut()
        if (total_items < take) {
            $(`#media-library-load-more-area_${unique_id}`).fadeOut()
        } else {
            $(`#media-library-load-more-area_${unique_id}`).fadeIn()
        }

        $(`#media-library-preview-container_${unique_id}`).fadeIn()
        $(`#media-library-preview_${unique_id}`).empty()
        let html = '';
        if (response.data.data.media_gallery.data.length > 0) {
            response.data.data.media_gallery.data.map((item) => {
                html += `<div class="col-md-3">
                                    <div class="preview-image-container">
                                        <div class="preview-image-container-action">
                                            <button type="button" data-photo-id="${item.id}" data-photo-name="${item.photo_name}" data-photo-url="${item.photo}" class="btn btn-sm btn-success media-library-image-select"><i class="fa-solid fa-check"></i></button>
                                            <button type="button" data-photo-id="${item.id}" data-photo-name="${item.photo_name}" data-photo-url="${item.photo}" class="btn btn-sm btn-info mx-1 media-library-image-large-preview"><i class="fa-solid fa-eye"></i></button>
                                            <button type="button" data-photo-id="${item.id}" data-photo-name="${item.photo_name}" data-photo-url="${item.photo}" class="btn btn-sm btn-danger media-library-image-delete"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                        <img data-photo-id="${item.id}" data-photo-url="${item.photo}" data-photo-name="${item.photo_name}" class="img-thumbnail media-library-image-preview mb-4 ${checkSelected(item.id)}" src="${item.photo}" alt="loader">
                                    </div>
                                </div>`;
            });
        } else {
            html += `<div class="col-md-12 mb-4 pt-5">
                                <p class="text-center text-danger">No Media Found</p>
                            </div>`;
        }

        $(`#media-library-preview_${unique_id}`).html(html)
        let links = ``
        let is_there_active = false
        response.data.data.links.map((item) => {
            if (item.is_active) {
                is_there_active = true
            }
            links += `<li data-directory="${item.path}"  class="list-group-item cursor-pointer media-library-menu-list ${item.is_active ? 'active' : ''}">${item.name}</li>`
        })
        $(`#media-gallery-menu_${unique_id}`).html(links)
        $(`#media-gallery-menu_${unique_id}`).prepend(`<li data-directory=""  class="list-group-item cursor-pointer media-library-menu-list ${is_there_active ? '' : 'active'}">All</li>`)

    }).catch(function (error) {

    })
}
$(document).on('click', `.media-library-upload-button-expended`, function () {
    $(`#upload-photo-modal_${unique_id}`).modal('show')
})

$(`.media-library-create-new-folder`).on('click', function () {
    $(document).find(`#media-library-create-new-folder-modal_${unique_id}`).modal('show')
})
$('.image-upload-button').on('click', function () {
    unique_id = $(this).data('unique-id')
    is_allow_multiple = $(this).data('allow-multiple')
    if (is_allow_multiple == undefined) {
        is_allow_multiple = true
    }
    let temp_input_target = $(this).data('input-target')
    if (temp_input_target != undefined) {
        input_target = temp_input_target
    }
    let temp_display_target = $(this).data('display-target')
    if (temp_display_target != undefined) {
        display_target = temp_display_target
    }
    let temp_type = $(this).data('type')
    if (temp_type != undefined) {
        type = temp_type
    }


    $(`#image_upload_modal_${unique_id}`).modal('show')
    let config = {
        'path': path
    }

    get_media_library(get_media_library_route, config)
})
$(`.create-new-folder-submit`).on('click', function () {
    let folderName = $(`#media-library-create-new-folder-input_${unique_id}`).val()
    if (folderName == '') {
        $(`#media-library-create-new-folder-input_${unique_id}`).addClass('is-invalid')
        $(`#media-library-create-new-folder-error_${unique_id}`).text('Folder name is required')
        return
    }
    let data = {
        'folder_name': folderName,
        'path': path
    }
    axios.post(create_new_directory_route, data).then(function (response) {
        $(`#media-library-create-new-folder-modal_${unique_id}`).modal('hide')
        let config = {}
        get_media_library(get_media_library_route, config)
    }).catch(function (error) {

    })

})

$(`.upload-photo-input`).on('change', function () {
    $(`#image_upload_modal_close_${unique_id}`).click()
    let images = this.files
    for (let i = 0; i < images.length; i++) {
        let formData = new FormData();
        formData.append('file', images[i])
        formData.append('path', path)

        axios.post(upload_media_library_route, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                $(`#progressBar_${unique_id}`).css({ 'width': progress + '%', 'display': 'block' }).text(progress + '%');
                if (progress == 100) {
                    $(`#progressBar_${unique_id}`).css('display', 'none');
                }
            }
        }).then(function (response) {
            let config = {
                'path': path
            }
            get_media_library(get_media_library_route, config)
        }).catch(function (error) {
        })
    }


})

$(document).on('click', '.media-library-menu-list', function () {
    $(`#media-library-load-more-area_${unique_id}`).fadeIn()
    take = 24
    $(this).addClass('active').siblings().removeClass('active')
    $(`#loader_${unique_id}`).fadeIn()
    $(`#media-library-preview-container_${unique_id}`).fadeOut()
    path = $(this).data('directory')
    let config = {
        'path': path,
        'take': take
    }
    get_media_library(get_media_library_route, config)
})

$(document).on('click', '.media-library-image-large-preview', function () {
    $(`#media-library-preview-large-container-modal_${unique_id}`).modal('show')
    $(`#media-library-preview-large-img_${unique_id}`).attr('src', $(this).data('photo-url'))
})

$(document).on('click', '.media-library-image-delete', function () {
    Swal.fire({
        title: "Are you sure delete this image?",
        text: "Image will be deleted permanently from drive you would not be able to recover it!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let id = $(this).data('photo-id')
            let data = {
                'id': id
            }
            axios.post(delete_media_library_route, data).then(function (response) {
                let config = {
                    'path': path,
                    'take': take
                }
                get_media_library(get_media_library_route, config)
                Swal.fire({
                    title: "Deleted!",
                    text: "Photo has been deleted.",
                    icon: "success"
                });
            })

        }
    });
})


$(`.media-library-load-more`).on('click', function () {
    take += 24
    let config = {
        'path': path,
        'take': take
    }

    if ((total_items + 24) >= take) {
        get_media_library(get_media_library_route, config)
    }
})


$(document).on('click', '.media-library-image-select', function () {

    $(this).parent('.preview-image-container-action')
        .siblings('img').toggleClass('selected-photo')

    if ($(this).children('i').hasClass('fa-check')) {
        $(this).children('i').addClass('fa-xmark').removeClass('fa-check')
    } else {
        $(this).children('i').removeClass('fa-xmark').addClass('fa-check')
    }
    let url = $(this).data('photo-url')
    let name = $(this).data('photo-name')
    let id = $(this).data('photo-id')
    let contains_id = false;


    if (selected_photo[unique_id]) {
        contains_id = selected_photo[unique_id]?.some(item => item.id === id)
    }
    if (!contains_id) {
        if (is_allow_multiple) {
            if (selected_photo[unique_id]) {
                selected_photo[unique_id].push({
                    'url': url,
                    'name': name,
                    'id': id
                })
            } else {
                selected_photo[unique_id] = []
                selected_photo[unique_id].push({
                    'url': url,
                    'name': name,
                    'id': id
                })
            }

        } else {
            selected_photo[unique_id] = [{
                'url': url,
                'name': name,
                'id': id
            }]

            $(this)
                .parent('.preview-image-container-action')
                .parent('.preview-image-container')
                .parent('div')
                .siblings('div')
                .children('.preview-image-container')
                .children('img')
                .removeClass('selected-photo')
        }

    } else {
        let index = selected_photo[unique_id].findIndex(item => item.id === id);
        if (index !== -1) {
            selected_photo[unique_id].splice(index, 1);
        }
    }

    if (type === 'extended') {
        set_preview_image_extended()
    } else {
        set_preview_image()
    }
    set_input_field_data()
})
