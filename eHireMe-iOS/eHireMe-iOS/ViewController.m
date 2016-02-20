//
//  ViewController.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/19/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)loginButtonPressed:(UIButton *)sender {
    NSString *email = self.emailTextField.text;
    NSString *password = self.passwordTextField.text;
    
    if (email.length == 0 || password.length == 0) {
        [[[UIAlertView alloc] initWithTitle:@"Hey!" message:@"Fill out the form plz.." delegate:nil cancelButtonTitle:@"Fine.." otherButtonTitles:nil] show];
        return;
    }
    
    NSLog([NSString stringWithFormat:@"%@ %@", email, password]);
}

@end
