export type PostProps = {
  id: string;
  link: string;
  content: string;
  createdAt: string;
  author: string;
  score: number;
};

export class Post {
  private constructor(private props: PostProps) {}

  public static create(
    id: string,
    author: string,
    content: string,
    link: string,
    createdAt: string
  ): Post {
    return new Post({
      id,
      author,
      content,
      link,
      createdAt,
      score: 0,
    });
  }

  public static with(props: PostProps): Post {
    return new Post(props);
  }

  public get id() {
    return this.props.id;
  }

  public get author() {
    return this.props.author;
  }

  public get link() {
    return this.props.link;
  }

  public get content() {
    return this.props.content;
  }

  public get score() {
    return this.props.score;
  }

  public setScore(score: number): void {
    this.props.score = score;
  }

  public toJSON(): PostProps {
    return {
      ...this.props,
    };
  }
}
