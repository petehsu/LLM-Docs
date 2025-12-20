# 3D 游戏

> 从 Game Boy 到 3D Tetris：GLM 帮我重构童年幻想

> 本文作者：加一，游戏产品经理，经典游戏发烧友，努力让游戏成为连接人与人、打开新世界的方式

小时候，我那台厚实的 Game Boy 是我最珍贵的宝物。当时我常常看着俄罗斯像素方块出神：如果我进入俄罗斯方块的世界该有多酷，它们棱角分明，我从不同角度旋转摆放他们，是我做了很久的梦。

这个幻想随着时间慢慢褪色，直到我开始使用 GLM Coding Plan，解锁了 Claude 和 GLM-4.5 这个绝妙组合。我输入以下 prompt：

```prompt  theme={null}
Create a 3D Tetris game: the coordinate axes consist of x, y, z; the Tetris blocks are 3D;
the view can be smoothly rotated with the mouse. At the bottom of the axes, add grid lines
to help users place the Tetris blocks.
```

它就把我的梦想变成了现实，效果非常好：

<video src="https://cdn.bigmodel.cn/static/3dgame/3d-game-2.mp4" controls />

GLM-4.5 是智谱的 open weight model，它的基准测试在编程方面得分很高，甚至在多轮函数调用上击败了 Claude Sonnet 4.1 和 Opus4。我在终端输入以下命令就启动成功了，具体教程可以看看官方给的[文档](https://docs.bigmodel.cn/cn/coding-plan/claude)。

![Description](https://cdn.bigmodel.cn/markdown/17576463181343d-game-1.png?attname=3d-game-1.png)

起初，我一直用这个组合处理复杂任务，它的响应速度、代码质量和边缘问题处理能力都表现得非常出色，尤其是3D建模能力让我印象深刻。当我试图用它做一些有趣的事情来逃避工作时，我想：为什么不用它来实现我小时候的梦想？

于是，事情开始变得有趣。作为一个开发者，我深知 2D 到 3D 游戏的转化有多么复杂，旋转矩阵、投影变换、3D碰撞检测这些概念足以让大多数模型都晕头转向，但 GLM-4.5 做的非常好。

## 它是如何拆解 3D 任务的？

这个 3D 游戏真正的挑战在于重新构想游戏机制。在 3D 空间中，方块应该在 x, y, z 三个轴上都能消除？碰撞检测如何工作？

这里 GLM-4.5 展现了它的价值。当我提出：

```prompt  theme={null}
Please implement the standard Tetris rule: whenever a full row of blocks is filled, that
row should be removed and the blocks above it should fall down.  And apply the same logic
in all three directions (x, y, and z). If a full row is completed along any axis-aligned
plane, that row should be cleared.
```

它没有简单生成代码，而是先提供了一个清晰的设计，说明消除逻辑的数据结构是怎样的，并且列出了一个详细的任务计划，让我的任务框架一下子可见，不再是 AI 默默编码，我费力找 bug 了：

![Description](https://cdn.bigmodel.cn/markdown/17576463281443d-game-2.png?attname=3d-game-2.png)

![Description](https://cdn.bigmodel.cn/markdown/17576463399653d-game-3.png?attname=3d-game-3.png)

```markdown  theme={null}
Data Structure:
    Board: gameBoard[y][x][z] - 3D array storing block colors
    Plane Detection: Iterate through each axis checking for complete fills
    Block Shifting: Reorganize 3D array when planes are removed
TODO List：
    Analyze current Y-axis line clearing implementation
    Implement X-axis plane clearing (vertical left/right walls)
    Implement Z-axis plane clearing (vertical front/back walls)
    Integrate all three axis clearing into main clearLines function
    Test line clearing in all three directions
    Verify proper block shifting and scoring
```

然后才给出了实现：

![Description](https://cdn.bigmodel.cn/markdown/17576463452343d-game-4.png?attname=3d-game-4.png)

```javascript  theme={null}
function clearLines() {
      let linesCleared = 0;

      // Y-axis clearing (horizontal planes)
      for (let y = 0; y < BOARD_HEIGHT; y++) {
          let lineComplete = true;
          for (let x = 0; x < BOARD_WIDTH; x++) {
              for (let z = 0; z < BOARD_DEPTH; z++) {
                  if (gameBoard[y][x][z] === 0) { lineComplete = false; break; }
              }
              if (!lineComplete) break;
          }
          if (lineComplete) {
              gameBoard.splice(y, 1);
              gameBoard.push(createEmptyLine());
              linesCleared++; y--;
          }
      }

      // X-axis clearing (vertical left/right walls)
      for (let x = 0; x < BOARD_WIDTH; x++) {
          let planeComplete = true;
          for (let y = 0; y < BOARD_HEIGHT; y++) {
              for (let z = 0; z < BOARD_DEPTH; z++) {
                  if (gameBoard[y][x][z] === 0) { planeComplete = false; break; }
              }
              if (!planeComplete) break;
          }
          if (planeComplete) {
              for (let y = 0; y < BOARD_HEIGHT; y++) {
                  gameBoard[y].splice(x, 1);
                  gameBoard[y].push(createEmptyColumn());
              }
              linesCleared++; x--;
          }
      }

      // Z-axis clearing (vertical front/back walls)
      for (let z = 0; z < BOARD_DEPTH; z++) {
          let planeComplete = true;
          for (let y = 0; y < BOARD_HEIGHT; y++) {
              for (let x = 0; x < BOARD_WIDTH; x++) {
                  if (gameBoard[y][x][z] === 0) { planeComplete = false; break; }
              }
              if (!planeComplete) break;
          }
          if (planeComplete) {
              for (let y = 0; y < BOARD_HEIGHT; y++) {
                  for (let x = 0; x < BOARD_WIDTH; x++) {
                      gameBoard[y][x].splice(z, 1);
                      gameBoard[y][x].push(0);
                  }
              }
              linesCleared++; z--;
          }
      }

      if (linesCleared > 0) {
          lines += linesCleared;
          score += linesCleared * 100 * level;
          updateScore();
      }
  }
```

当我不理解如何在三维空间内判断体积占用，进行碰撞检测时，GLM-4.5 的回应超出了我的预期。它不仅提供了代码，还解释了实现策略，简直是伙伴级的开发体验：

![Description](https://cdn.bigmodel.cn/markdown/17576463502493d-game-5.png?attname=3d-game-5.png)

<Tabs>
  <Tab title="Collision Detection">
    ```javascript  theme={null}
    function checkCollision(piece, newX, newY, newZ) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    const boardZ = newZ;

                    // Boundary collision detection
                    if (boardX < 0 || boardX >= BOARD_WIDTH ||
                        boardY < 0 ||
                        boardZ < 0 || boardZ >= BOARD_DEPTH ||
                        // Block collision detection
                        (boardY < BOARD_HEIGHT && gameBoard[boardY][boardX][boardZ])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    Key Collision Logic

    Boundary Checks (lines 627-629):
    - boardX < 0 || boardX >= BOARD_WIDTH - X-axis boundaries (left/right walls)
    - boardY < 0 - Y-axis boundary (bottom/floor)
    - boardZ < 0 || boardZ >= BOARD_DEPTH - Z-axis boundaries (front/back walls)
    ```
  </Tab>

  <Tab title="Technical Reason">
    ```markdown  theme={null}
    The collision detection system uses a grid-based approach where:
    - Each piece is represented as a 2D array (shape) that gets mapped to 3D coordinates
    - For each occupied cell in the piece's shape, it checks if the target position on the game board is valid
    - It checks both boundary collisions (edges of the game board) and block collisions (other pieces)
    ```
  </Tab>
</Tabs>

## 一个例子作为补充

为了验证它的 3D 能力是否真的如此全面，我又尝试了一个完全不同类型的挑战：创建一个简单的 3D 太阳系，要求能够通过鼠标控制视角。这不仅考验 3D 建模能力，还需要处理星球间的位置大小关系和排布。

令我惊讶的是，GLM4.5 不仅生成了 3D 太阳系，还自动处理了不同星球位置、大小关系这个通常令人头疼的问题，甚至模拟的公转和自转的状态。它创建的代码中，每个部件都详细地列好了位置信息和比例，整体风格匹配也设置得恰到好处。GLM-4.5 的 3D 建模能力真的很强！

<video src="https://cdn.bigmodel.cn/static/3dgame/3d-game-1.mp4" controls />

## GLM-4.5 的编码体验不止于代码质量

整个 3D 游戏实现过程中，最吸引人的不是最终产品，而是开发体验。GLM-4.5 确保了代码质量，生成的不是草稿，而是可维护的生产级代码。

最终成果是一个既熟悉又新奇的作品，它触动了我的怀旧情怀，又满足了我童年时的梦想和好奇心。也许最让我满意的是，GLM-4.5 作为顶尖的 AI 代码工具，终于追上了我童年的想象力，那些曾经只存在于幻想中的创意，现在可以用自然语言描述并转化为现实——我们要做的只有保持好奇心。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt