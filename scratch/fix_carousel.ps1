$content = Get-Content Assets/css/style.css
$newSection = @'
.carousel-track {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 120px calc(50% - 240px) 150px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    align-items: center;
    perspective: 2000px;
    transform-style: preserve-3d;
}

.carousel-track::-webkit-scrollbar {
    display: none;
}

.carousel-card {
    width: 480px;
    min-width: 480px;
    max-width: 480px;
    min-height: 620px;
    flex-shrink: 0;
    scroll-snap-align: center;
    background: var(--bg-white);
    border: 4px solid var(--bg-dark);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transform-style: preserve-3d;
    cursor: pointer;
    opacity: 0.6;
}

.carousel-card.active {
    opacity: 1;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2), var(--toon-shadow-lg);
}
'@

$before = $content[0..1943]
$after = $content[1995..($content.Length-1)]
$result = $before + $newSection + $after
$result | Set-Content Assets/css/style.css
