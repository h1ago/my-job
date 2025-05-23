export type JobProps = {
  id: string;
  title: string;
  company: string;
  link: string;
  content: string;
  postedDate: string;
  location?: string;
  score: number;
};

export class Job {
  private constructor(private props: JobProps) {}

  public static create(
    id: string,
    title: string,
    company: string,
    link: string,
    content: string,
    postedDate: string,
    location: string | undefined
  ): Job {
    return new Job({
      id,
      title,
      company,
      link,
      content,
      postedDate,
      location,
      score: 0,
    });
  }

  public static with(props: JobProps): Job {
    return new Job(props);
  }

  public get id() {
    return this.props.id;
  }

  public get title() {
    return this.props.title;
  }

  public get company() {
    return this.props.company;
  }

  public get link() {
    return this.props.link;
  }

  public get content() {
    return this.props.content;
  }

  public get postedDate() {
    return this.props.postedDate;
  }

  public get location() {
    return this.props.location;
  }

  public get score() {
    return this.props.score;
  }

  public setScore(score: number): void {
    this.props.score = score;
  }

  public toJSON(): JobProps {
    return {
      ...this.props,
    };
  }
}
