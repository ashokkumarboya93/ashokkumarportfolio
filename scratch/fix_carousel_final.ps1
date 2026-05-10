$content = Get-Content Assets/css/style.css
$newSection = @'
/* --- Carousel Track --- */
.carousel-track {
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 0 calc(50vw - 175px);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    perspective: 1000px;
}

.carousel-track::-webkit-scrollbar {
    display: none;
}

.carousel-card {
    width: 350px;
    height: 250px;
    background: #fff;
    border-radius: 12px;
    flex-shrink: 0;
    scroll-snap-align: center;
    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    transition: transform 0.1s ease-out, opacity 0.1s ease-out;
    transform-origin: center center;
    cursor: pointer;
}

.carousel-card.active {
    z-index: 50;
}

.carousel-card-img {
    width: 100%;
    height: 160px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.carousel-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.carousel-card-body {
    padding: 0;
    margin-top: 10px;
    border-top: 2px solid #eee;
    padding-top: 10px;
}

.project-card-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
}
'@

$before = $content[0..1943]
$after = $content[1998..($content.Length-1)]
$result = $before + $newSection + $after
$result | Set-Content Assets/css/style.css
