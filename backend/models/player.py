class PlayerStats:
    gp: int
    mpg: float
    fgm: float
    fga: float
    ftm: float
    fta: float
    tpm: float
    pts: float
    reb: float
    ast: float
    stl: float
    blk: float
    to: float

    def __init__(self, gp, mpg, fgm, fga, ftm, fta, tpm, pts, reb, ast, stl, blk, to):
        self.gp = gp
        self.mpg = mpg
        self.fgm = fgm
        self.fga = fga
        self.ftm = ftm
        self.fta = fta
        self.tpm = tpm
        self.pts = pts
        self.reb = reb
        self.ast = ast
        self.stl = stl
        self.blk = blk
        self.to = to


class Player:
    id: int  # ESPN Player ID
    first_name: str
    last_name: str
    team_id: int
    team: str
    age: int | None
    headshot: str
    years_pro: int
    jersey: int | None
    # TODO: add height and weight
    # TODO: add injuries
    # TODO: add salary
    rank: int  # Rank in projections
    adp: float  # Average Draft Position
    positions: list[str]  # List of position eligibilities
    projections: PlayerStats
    past_year_stats: PlayerStats | None
    auction_valued_at: float | None
    auction_yahoo_avg: float | None
    auction_espn_avg: float | None
    auction_blend_avg: float | None

    def __init__(
        self,
        id,
        first_name,
        last_name,
        positions,
        team_id,
        team,
        age,
        headshot,
        years_pro,
        jersey,
        rank,
        adp,
        projections,
        past_year_stats,
        auction_valued_at,
        auction_yahoo_avg,
        auction_espn_avg,
        auction_blend_avg,
    ):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.positions = positions
        self.team_id = team_id
        self.team = team
        self.age = age
        self.headshot = headshot
        self.years_pro = years_pro
        self.jersey = jersey
        self.rank = rank
        self.adp = adp
        self.projections = projections
        self.past_year_stats = past_year_stats
        self.auction_valued_at = auction_valued_at
        self.auction_yahoo_avg = auction_yahoo_avg
        self.auction_espn_avg = auction_espn_avg
        self.auction_blend_avg = auction_blend_avg
