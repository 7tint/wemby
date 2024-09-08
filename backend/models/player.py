class PlayerStats:
    fg: float
    ft: float
    tpm: float
    pts: float
    reb: float
    ast: float
    stl: float
    blk: float
    to: float
    gp: int
    mpg: float

    def __init__(self, fg, ft, tpm, pts, reb, ast, stl, blk, to, gp, mpg):
        self.fg = fg
        self.ft = ft
        self.tpm = tpm
        self.pts = pts
        self.reb = reb
        self.ast = ast
        self.stl = stl
        self.blk = blk
        self.to = to
        self.gp = gp
        self.mpg = mpg


class Player:
    id: int  # ESPN Player ID
    first_name: str
    last_name: str
    team_id: int
    team: str
    age: int | None
    headshot: str
    years_pro: int
    jersey: int
    # TODO: add height and weight
    # TODO: add injuries
    # TODO: add salary
    rank: int  # Rank in projections
    adp: float  # Average Draft Position
    positions: list[str]  # List of position eligibilities
    projections: PlayerStats
    past_year_stats: PlayerStats | None

    def __init__(
        self, id, first_name, last_name, team_id, team, age, headshot, years_pro, jersey
    ):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.team_id = team_id
        self.team = team
        self.age = age
        self.headshot = headshot
        self.years_pro = years_pro
        self.jersey = jersey
