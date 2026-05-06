# Get youtube videos
GET
https://api.freeapi.app/api/v1/public/youtube/videos
This API endpoint enables you to retrieve all YouTube videos from a JSON file with a structure similar to YouTube's public API.

Upon accessing this endpoint, you will receive a response containing a list of YouTube videos, just like you would from YouTube's official API.

Disclaimer:

Data provided by the API is static and not real-time.

This simplifies the process of developing a YouTube clone, allowing developers to solely focus on UI design and creativity, without worrying about complex API key configuration.

Path params
page
string
1
limit
string
10
query
string
javascript
sortBy
string
keep one: mostLiked | mostViewed | latest | oldest



--------

Get video by id
GET
https://api.freeapi.app/api/v1/public/youtube/videos/{videoId}
This API endpoint allows you to retrieve a YouTube video's complete details by passing the videoId as a path variable.

When accessing this endpoint with a valid video ID, you will receive a response containing comprehensive information about the specified video.

This includes video statistics such as the number of likes, dislikes, views, and the video's duration, as well as other relevant details like the video title, description, channel name, and publication date.

This functionality enables you to access and display detailed information about specific YouTube videos within your application.

Disclaimer:

Data provided by the API is static and not real-time.

This simplifies the process of developing a YouTube clone, allowing developers to solely focus on UI design and creativity, without worrying about complex API key configuration.

Path params
videoId
string
required
EQwmQLU1S6I
Sample responses

200



------


Get video comments
GET
https://api.freeapi.app/api/v1/public/youtube/comments/{videoId}
The API endpoint allows you to retrieve YouTube video comments based on the video's unique ID provided as a path variable.

When accessing this endpoint, you will receive a response containing complete details of the comments, including the author's information, like count, and the comment content.

This functionality facilitates accessing and displaying comprehensive comment data for a specific YouTube video.

Disclaimer:

Data provided by the API is static and not real-time.

This simplifies the process of developing a YouTube clone, allowing developers to solely focus on UI design and creativity, without worrying about complex API key configuration.

Path params
videoId
string
required
cv-6bAeYsOY


-----

Get related videos
GET
https://api.freeapi.app/api/v1/public/youtube/related/{videoId}
The API endpoint returns a list of recommended YouTube videos based on the videoId provided in the path variable.

When accessing this endpoint and passing a valid video ID, you will receive a response containing a list of videos that are related to the current video.

These recommended videos can be displayed in a list view on the right side of the user interface, providing users with relevant and engaging content that complements the video they are currently viewing.

Disclaimer:

Data provided by the API is static and not real-time.

This simplifies the process of developing a YouTube clone, allowing developers to solely focus on UI design and creativity, without worrying about complex API key configuration.

Path params
page
string
1
limit
string
5
videoId
string
required
eLyISYdoVac
Sample responses

200



---


Get playlists
GET
https://api.freeapi.app/api/v1/public/youtube/playlists
This API endpoint allows users to retrieve playlists associated with the channel.

By accessing this endpoint, users can obtain a collection of playlists that belong to the channel.

This functionality is particularly useful for implementing a "Playlists" tab in the channel page UI design, where users can view the playlists conveniently.

Disclaimer:

Data provided by the API is static and not real-time.

This simplifies the process of developing a YouTube clone, allowing developers to solely focus on UI design and creativity, without worrying about complex API key configuration.

Path params
page
string
1
limit
string
5
Sample responses

200
 ----
 Get playlist details and items
GET
https://api.freeapi.app/api/v1/public/youtube/playlists/{playlistId}
This API endpoint provides the details of a playlist, including playlist metadata and the videos included in the playlist, based on the specified playlist ID.

When accessing this endpoint and providing a valid playlist ID as a parameter, you will receive a response containing comprehensive information about the playlist, such as its title, description, and other metadata.

Additionally, the response will include a list of videos that are part of the playlist, enabling you to access the video details.

Disclaimer:

Data provided by the API is static and not real-time.

This simplifies the process of developing a YouTube clone, allowing developers to solely focus on UI design and creativity, without worrying about complex API key configuration.

Path params
playlistId
string
required
PLRAV69dS1uWSx4erHGq8hW_GE-Eaj60r-
Sample responses

200
